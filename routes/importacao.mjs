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

  try {
    let tables = await findTables(connection, req.body.owner);
    let project = { name: req.body.owner };
    project.screens = [];

    for (let table of tables) {
      project.screens.push(
        await generateScreen(connection, req.body.owner, table)
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
    ON t.OWNER = c.OWNER AND t.TABLE_NAME  = c.TABLE_NAME  WHERE t.OWNER = :owner`,
    { owner }
  );

  return result.rows;
}

async function generateScreen(connection, owner, table) {
  let screen = {
    label: table.COMMENTS || "Cadastro de " + normalizeText(table.TABLE_NAME),
    entity: toCamelCase(table.TABLE_NAME),
    name: singularIdentifier(table.TABLE_NAME),
    plural_name: pluralIdentifier(table.TABLE_NAME),
    type: "grid",
    subfields: await generateFields(connection, owner, table.TABLE_NAME),
  };

  return screen;
}

async function generateFields(connection, owner, tableName) {
  const result = await connection.execute(
    `SELECT tc.column_name, tc.data_type, tc.data_length, tc.data_precision, tc.nullable, cc.COMMENTS  
    FROM all_tab_columns tc
    	LEFT JOIN ALL_COL_COMMENTS cc ON tc.OWNER = cc.OWNER AND tc.TABLE_NAME = cc.TABLE_NAME  AND tc.COLUMN_NAME = cc.COLUMN_NAME 
    WHERE tc.owner = :owner AND tc.table_name = :tableName`,
    { owner, tableName }
  );

  let fields = [];

  for (let column of result.rows) {
    fields.push({
      id: column.COLUMN_NAME,
      name: column.COLUMN_NAME,
      label: column.COMMENTS || column.COLUMN_NAME,
      type: translateType(column.DATA_TYPE),
      subfields: [],
    });
  }

  return fields;
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
