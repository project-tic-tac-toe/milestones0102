var Router = require("restify-router").Router;
var router = new Router();

let knex = require("./../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("products")
    .select("*")
    .then(products => {
      res.send({
        productsMessage: "List of all products",
        debugMessage: "Successful return ",
        data: { products }
      });
    });
});

router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.send({
      code: 0,
      productsMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("products")
    .where({ id: id })
    .select("*")
    .then(products => {
      if (products.length === 0) {
        res.send({
          code: 0,
          productsMessage: `No product with id ${id}`,
          debugMessage: "Found no product",
          data: { products }
        });
      } else
        res.send({
          code: 1,
          productsMessage: "Found one product",
          debugMessage: "Successful return ",
          data: { products }
        });
    });
});

//INSERT

router.post("", (req, res, next) => {
  let name = req.body.name;
  let prize = parseFloat(req.body.prize);
  let image = req.body.image;

  if (prize != req.body.prize) prize = null;

  knex
    .insert({
      name,
      prize,
      image
    })
    .into("products")
    .returning("id")
    .then(id => {
      res.send({
        code: 1,
        productsMessage: "A new product has been created",
        debugMessage: `New product with id ${id} has been created`,
        data: id
      });
    });
});

//UPDATE

router.put("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);
  let name = req.body.name;
  let prize = parseFloat(req.body.prize);
  let image = req.body.image;

  if (prize != req.body.prize) prize = null;

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      productsMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("products")
    .where({ id: idFind })
    .update({
      name,
      prize,
      image
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          productsMessage: `No product with id ${idFind}`,
          debugMessage: "Found no product",
          data: id
        });
      else
        res.send({
          code: 1,
          productsMessage: "A new product has been updated",
          debugMessage: `New product with id ${id} has been updated`,
          data: id
        });
    });
});

router.del("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      productsMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("products")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          productsMessage: `No product with id ${idFind}`,
          debugMessage: "Found no product",
          data: ""
        });
      else
        res.send({
          code: result,
          productsMessage: `A product has been deleted`,
          debugMessage: `A product with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
