var knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-174-129-33-167.compute-1.amazonaws.com",
    user: "ftbskghtdjinwq",
    password:
      "fe0f5f08407cd2aa2149a7c8b1dcda42efe3a37ecf011758d585e0e835a6354b",
    database: "d3ju9q61kpb0r8",
    ssl: true
  }
});

exports.default = knex;
