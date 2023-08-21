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
    ON t.OWNER = c.OWNER AND t.TABLE_NAME  = c.TABLE_NAME  WHERE t.OWNER = :owner AND t.table_name = 'AUD_HIST_AUXILIAR_EMPRESA'
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

  const relationships = await generateRelationships(
    connection,
    owner,
    table.TABLE_NAME,
    commentAsLabel
  );

  const subfields = await generateFields(
    connection,
    owner,
    table.TABLE_NAME,
    commentAsLabel
  );

  const tables = await generateTables(
    connection,
    owner,
    table.TABLE_NAME,
    commentAsLabel
  );

  let screen = {
    label,
    entity: toCamelCase(table.TABLE_NAME),
    table: table.TABLE_NAME,
    name: singularIdentifier(table.TABLE_NAME),
    plural_name: pluralIdentifier(table.TABLE_NAME),
    type: "grid",
    subfields: relationships.concat(subfields).concat(tables),
  };

  return screen;
}

async function generateFields(connection, owner, tableName, commentAsLabel) {
  const result = await connection.execute(
    `SELECT tc.column_name, tc.data_type, tc.data_length, tc.data_precision, tc.nullable, cc.COMMENTS, tc.TABLE_NAME, count(acc.CONSTRAINT_NAME) AS FOREIGNKEY  
    FROM all_tab_columns tc
    	LEFT JOIN ALL_COL_COMMENTS cc ON tc.OWNER = cc.OWNER AND tc.TABLE_NAME = cc.TABLE_NAME  AND tc.COLUMN_NAME = cc.COLUMN_NAME 
    	LEFT JOIN ALL_CONSTRAINTS  ac ON ac.OWNER  = tc.OWNER  AND ac.TABLE_NAME = tc.TABLE_NAME AND ac.CONSTRAINT_TYPE = 'R'
    	LEFT JOIN ALL_CONS_COLUMNS acc ON acc.OWNER  = ac.OWNER AND acc.CONSTRAINT_NAME = ac.CONSTRAINT_NAME AND acc.TABLE_NAME = tc.TABLE_NAME AND acc.COLUMN_NAME = tc.COLUMN_NAME 
    WHERE tc.owner = :owner AND tc.table_name = :tableName
    GROUP BY tc.COLUMN_ID, tc.column_name, tc.data_type, tc.data_length, tc.data_precision, tc.nullable, cc.COMMENTS, tc.TABLE_NAME
    ORDER BY tc.COLUMN_ID `,
    { owner, tableName }
  );

  let fields = [];

  for (let column of result.rows) {
    if (column.FOREIGNKEY) continue;

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
      cols: defineCols(column.DATA_TYPE, column.DATA_LENGTH),
      subfields: [],
    });
  }

  return fields;
}

async function generateRelationships(
  connection,
  owner,
  tableName,
  commentAsLabel
) {
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
                      AND a.table_name = :tableName
                  GROUP BY a.owner, a.table_name, a.constraint_name
              ) d
            WHERE c.owner = :owner
              AND c.owner = d.owner
              AND c.table_name = d.table_name
              AND c.constraint_name = d.constraint_name
            ORDER BY c.owner, c.table_name, c.constraint_name`;

  const result = await connection.execute(sql, { owner, tableName });

  let fields = [];

  for (let column of result.rows) {
    let identifier = "";
    if (column.COLUMNS.includes(",")) {
      identifier = column.R_TABLE;
    } else {
      identifier = column.COLUMNS;
    }

    let label = "";
    if (commentAsLabel && identifier == column.COLUMNS) {
      const result = await connection.execute(
        `SELECT cc.COMMENTS  
        FROM ALL_COL_COMMENTS cc 
        WHERE cc.OWNER = :owner 
        AND cc.TABLE_NAME = :tableName 
        AND cc.COLUMN_NAME = :columnName`,
        { owner, tableName, columnName: column.COLUMNS }
      );
      if (result.rows.length > 0) {
        label = result.rows[0].COMMENTS;
      }
    } else {
      label = normalizeText(identifier);
    }

    const result = await connection.execute(
      `SELECT CC.COLUMN_NAME  
      FROM ALL_CONS_COLUMNS CC
      WHERE CC.OWNER = :referencedOwner 
        AND CC.TABLE_NAME = :referencedTable 
        AND CC.CONSTRAINT_NAME = :constraintName 
      ORDER BY CC.POSITION`,
      {
        referencedOwner: column.R_OWNER,
        referencedTable: column.R_TABLE,
        constraintName: column.R_CONSTRAINT_NAME,
        referencedEntity: column.R_TABLE,
      }
    );

    const referencedColumns = result.rows
      .map((item) => item.COLUMN_NAME)
      .join(",");

    fields.push({
      id: identifier,
      name: identifier,
      column: column.COLUMNS,
      label,
      type: "relationship",
      widgetType: await determineRelationshipType(
        connection,
        column.R_OWNER,
        column.R_TABLE
      ),
      referencedTable: column.R_TABLE,
      referencedSchema: column.R_OWNER,
      referencedColumn: referencedColumns,
      subfields: [],
    });
  }

  return fields;
}

async function generateTables(connection, owner, tableName, commentAsLabel) {
  const sql = `SELECT c.owner, c.TABLE_NAME
              FROM
                  all_constraints c
              WHERE c.CONSTRAINT_TYPE = 'R'
                  AND r_constraint_name in (
                            SELECT cr.constraint_name 
                            FROM all_constraints cr 
                            WHERE cr.OWNER = :owner
                                AND cr.table_name = :tableName)`;

  const result = await connection.execute(sql, { owner, tableName });

  let fields = [];

  for (let table of result.rows) {
    const relationships = await generateRelationships(
      connection,
      owner,
      table.TABLE_NAME,
      commentAsLabel
    );

    const subfields = await generateFields(
      connection,
      owner,
      table.TABLE_NAME,
      commentAsLabel
    );

    fields.push({
      id: table.TABLE_NAME,
      name: table.TABLE_NAME,
      schema: table.OWNER,
      table: table.TABLE_NAME,
      label: normalizeText(table.TABLE_NAME),
      type: "table",
      cols: 12,
      subfields: relationships.concat(subfields),
    });
  }

  return fields;
}

async function determineRelationshipType(connection, owner, table) {
  const result = await connection.execute(
    `select count(*) as COUNT_ROWS from ${owner}.${table}`
  );

  if (result.rows[0].COUNT_ROWS > 30) {
    return "autocomplete";
  } else {
    return "select";
  }
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

function defineCols(dataType, dataLength) {
  if (dataType == "VARCHAR" || dataType == "VARCHAR2" || dataType == "CHAR") {
    if (dataLength <= 30) return 4;
    else if (dataLength <= 50) return 6;
    else return 12;
  } else if (dataType == "NUMBER" || dataType == "DATE") {
    return 4;
  } else return 12;
}

export default router;
