var knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-54-83-9-169.compute-1.amazonaws.com",
    user: "vkrpsybninavbh",
    password:
      "bf07a712499c29f09cf7d411b8c60c3d694a7a2f03119849f98184a27d599ac3",
    database: "dd1tqg3tu3ugco",
    ssl: true
  }
});

exports.default = knex;
