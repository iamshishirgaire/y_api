/** @type {import('kanel').Config} */

module.exports = {
  connection: "DATABASE_URL",
  preDeleteOutputFolder: true,
  outputPath: "./src/generated",

  customTypeMap: {
    "pg_catalog.tsvector": "string",
    "pg_catalog.bpchar": "string",
  },
};
