
var knex = require('knex')({
    client: 'postgres',
    connection: {
      host : 'ec2-54-243-44-102.compute-1.amazonaws.com',
      user : 'rklgfxjoiyfhrx',
      password : 'a5816f7ebf85e8d90458e2042df6d617e127d41de74801ed322255778026e06f',
      database : 'd8dnhd2ab6t24a',
      ssl: true
    }
  });

exports.default = knex;
