var Router = require("restify-router").Router;
var router = new Router();

let knex = require("../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("invoices_product")
    .select("*")
    .then(invoices => {
      res.send({
        invoicesMessage: "List of all invoices product",
        debugMessage: "Successful return ",
        data: { invoices }
      });
    });
});

router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.send({
      code: 0,
      invoicesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("invoices_product")
    .where({ id: id })
    .select("*")
    .then(invoices => {
      if (invoices.length === 0) {
        res.send({
          code: 0,
          invoicesMessage: `No invoices product with id ${id}`,
          debugMessage: "Found no invoices product",
          data: { invoices }
        });
      } else
        res.send({
          code: 1,
          invoicesMessage: "Found one invoices product",
          debugMessage: "Successful return ",
          data: { invoices }
        });
    });
});

//INSERT

router.post("", (req, res, next) => {
  let id_customer = req.body.id_customer;
  let create_at = new Date();
  let total=null;
  //let total = parseInt(req.body.total);

  //if (total != req.body.total) total = null;

  knex
    .insert({
      id_customer,
      create_at,
      total
    })
    .into("invoices_product")
    .returning("id")
    .then(id => {
      res.send({
        code: 1,
        invoicesMessage: "A new invoices product has been created",
        debugMessage: `New invoices product with id ${id} has been created`,
        data: id
      });
    });
});

//UPDATE

router.put("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);

  let id_customer = parseInt(req.body.id_customer);
  let create_at = new Date();
  
  if (id_customer != req.body.id_customer) id_customer = null;

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      invoicesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("invoices_product")
    .where({ id: idFind })
    .update({
      id_customer,
      create_at
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          invoicesMessage: `No  product with id ${idFind}`,
          debugMessage: "Found no product",
          data: id
        });
      else
        res.send({
          code: 1,
          invoicesMessage: "A new invoices product has been updated",
          debugMessage: `New invoices product with id ${id} has been updated`,
          data: id
        });
    });
});

router.del("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      invoicesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("invoices_product")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          invoicesMessage: `No invoice product with id ${idFind}`,
          debugMessage: "Found no invoice product",
          data: ""
        });
      else
        res.send({
          code: result,
          invoicesMessage: `A invoice product has been deleted`,
          debugMessage: `A invoice product with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
