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
        await generateScreen(connection, req.body.owner, table.TABLE_NAME)
      );
    }

    res.send(project).status(200);
  } finally {
    await connection.close();
  }
});

async function findTables(connection, owner) {
  const result = await connection.execute(
    `SELECT TABLE_NAME FROM all_tables WHERE OWNER = :owner`,
    { owner }
  );

  return result.rows;
}

async function generateScreen(connection, owner, table) {
  let screen = {
    label: "Cadastro de " + normalizeText(table),
    entity: toCamelCase(table),
    name: singularIdentifier(table),
    plural_name: pluralIdentifier(table),
    type: "grid",
    subfields: await generateFields(connection, owner, table),
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
