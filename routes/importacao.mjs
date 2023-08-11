import express from "express";
import oracledb from "oracledb";

const router = express.Router();

oracledb.initOracleClient({ libDir: process.env.INSTANT_CLIENT_HOME });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Get a list of 50 cadastros
router.post("/oracle", async (req, res) => {
  console.log(req.body.host + ":" + req.body.port + "/" + req.body.serviceName);

  const connection = await oracledb.getConnection({
    user: req.body.user,
    password: req.body.password,
    connectString:
      req.body.host + ":" + req.body.port + "/" + req.body.serviceName,
  });

  const commentAsLabel = req.body.commentAsLabel;

  try {
    let tables = await findTables(connection, req.body.owner);
    let project = { name: req.body.owner };
    project.screens = [];

    for (let table of tables) {
      project.screens.push(
        await generateScreen(connection, req.body.owner, table, commentAsLabel)
      );
    }

    res.send(project).status(200);
  } finally {
    await connection.close();
  }
});

async function findTables(connection, owner) {
  const result = await connection.execute(
    `SELECT t.TABLE_NAME, c.COMMENTS  FROM all_tables t LEFT JOIN all_tab_comments c 
    ON t.OWNER = c.OWNER AND t.TABLE_NAME  = c.TABLE_NAME  WHERE t.OWNER = :owner
    ORDER BY t.TABLE_NAME `,
    { owner }
  );

  return result.rows;
}

async function generateScreen(connection, owner, table, commentAsLabel) {
  let label = "";
  if (commentAsLabel) {
    label = table.COMMENTS || "Cadastro de " + normalizeText(table.TABLE_NAME);
  } else {
    label = normalizeText(table.TABLE_NAME);
  }
  let screen = {
    label,
    entity: toCamelCase(table.TABLE_NAME),
    table: table.TABLE_NAME,
    name: singularIdentifier(table.TABLE_NAME),
    plural_name: pluralIdentifier(table.TABLE_NAME),
    type: "grid",
    subfields: await generateFields(
      connection,
      owner,
      table.TABLE_NAME,
      commentAsLabel
    ),
  };

  return screen;
}

async function generateFields(connection, owner, tableName, commentAsLabel) {
  const result = await connection.execute(
    `SELECT tc.column_name, tc.data_type, tc.data_length, tc.data_precision, tc.nullable, cc.COMMENTS  
    FROM all_tab_columns tc
    	LEFT JOIN ALL_COL_COMMENTS cc ON tc.OWNER = cc.OWNER AND tc.TABLE_NAME = cc.TABLE_NAME  AND tc.COLUMN_NAME = cc.COLUMN_NAME 
    WHERE tc.owner = :owner AND tc.table_name = :tableName
    ORDER BY tc.COLUMN_ID`,
    { owner, tableName }
  );

  let fields = [];

  for (let column of result.rows) {
    let label = "";
    if (commentAsLabel) {
      label = column.COMMENTS || normalizeText(column.COLUMN_NAME);
    } else {
      label = normalizeText(column.COLUMN_NAME);
    }

    fields.push({
      id: column.COLUMN_NAME,
      name: column.COLUMN_NAME,
      column: column.COLUMN_NAME,
      label,
      type: translateType(column.DATA_TYPE),
      subfields: [],
    });
  }

  return fields;
}

async function findReferencedTables(connection, owner, tableName){
  const sql = `SELECT c.constraint_name, c.delete_rule, d.columns, c.r_owner,
              (SELECT r.table_name FROM sys.all_constraints r 
                  WHERE c.r_owner = r.owner AND c.r_constraint_name = r.constraint_name) AS R_TABLE,
              c.r_constraint_name
            FROM sys.all_constraints c,
              (
                  SELECT a.owner, a.table_name, a.constraint_name,
                MAX(DECODE(position,1,substr(column_name,1,30),NULL) )
                      ||  MAX(DECODE(position,2,',' || substr(column_name,1,30),NULL)) 
                      ||  MAX( DECODE(position,3,',' || substr(column_name,1,30),NULL)) 
                      ||  MAX(DECODE(position,4,',' || substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,5,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,6,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,7,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,8,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,9,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,10,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,11,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,12,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,13,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,14,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,15,',' ||  substr(column_name,1,30),NULL))
                      ||  MAX(DECODE(position,16,',' ||  substr(column_name,1,30),NULL)) columns
                  FROM sys.all_constraints a, sys.all_cons_columns b
                  WHERE a.constraint_name = b.constraint_name 
                      AND a.owner = b.owner
                      AND a.constraint_type = 'R'
                      AND substr(a.table_name,1,4) != 'BIN$'
                      AND substr(a.table_name,1,3) != 'DR$'
                      AND instr(upper(a.table_name),upper(:tableName) ) > 0
                  GROUP BY a.owner, a.table_name, a.constraint_name
              ) d
            WHERE c.owner = :owner
              AND c.owner = d.owner
              AND c.table_name = d.table_name
              AND c.constraint_name = d.constraint_name
            ORDER BY c.owner, c.table_name, c.constraint_name`;

  const result = await connection.execute(sql, {owner, tableName})
  
}

function translateType(type) {
  switch (type) {
    case "VARCHAR2":
      return "input";
    default:
      return "input";
  }
}

function normalizeText(text) {
  return text;
}

function toCamelCase(text) {
  return text;
}

function singularIdentifier(text) {
  return text;
}

function pluralIdentifier(text) {
  return text;
}

export default router;
