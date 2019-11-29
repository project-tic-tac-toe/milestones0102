var Router = require("restify-router").Router;
var router = new Router();
const {
  isCorrectId,
  getPrizeOfProduct,
  getDataForTable,
  updatePrizeTotalForInvoice
} = require("../helper/Helper");

const knex = require("../knexData").default;

//GET
router.get("", (req, res, next) => {
  knex("invoices_detail_product")
    .select("*")
    .then(invoices => {
      res.send({
        invoicesMessage: "List of all invoices detail product",
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
  knex("invoices_detail_product")
    .where({ id: id })
    .select("*")
    .then(invoices => {
      if (invoices.length === 0) {
        res.send({
          code: 0,
          invoicesMessage: `No invoices detail product with id ${id}`,
          debugMessage: "Found no invoices detail product",
          data: { invoices }
        });
      } else
        res.send({
          code: 1,
          invoicesMessage: "Found one invoices detail product",
          debugMessage: "Successful return ",
          data: { invoices }
        });
    });
});

//INSERT

router.post("", async function(req, res, next) {
  try {
    //id_product
    let id_product = isNaN(parseInt(req.body.id_product))
      ? null
      : parseInt(req.body.id_product);
    if (id_product !== null) {
      try {
        const result = await isCorrectId(id_product, "products")
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No product with id ${id_product}`,
            debugMessage: "Found no product",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    let id_invoice = isNaN(parseInt(req.body.id_invoice))
      ? null
      : parseInt(req.body.id_invoice);
    if (id_invoice !== null) {
      try {
        const result = await isCorrectId(id_invoice, "invoices_product")
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No invoice product with id ${id_invoice}`,
            debugMessage: "Found no invoice product",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    let quantity = isNaN(parseInt(req.body.quantity))
      ? 0
      : parseInt(req.body.quantity);
    let prize_product =
      id_product === null
        ? 0
        : await getPrizeOfProduct(id_product, "products").then(res => res);
    let total_product = prize_product * quantity * 1000;
    knex
      .insert({
        id_invoice,
        id_product,
        quantity,
        prize_product,
        total_product
      })
      .into("invoices_detail_product")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          invoicesMessage: "A new invoices detail product has been created",
          debugMessage: `New invoices detail product with id ${id} has been created`,
          data: id
        });
        updatePrizeTotalForInvoice([id_invoice]);
      });
  } catch (error) {
    res.send({
      code: 0,
      employeesMessage: "Not enough data fields",
      debugMessage: "Not enough data fields",
      data: ""
    });
  }
});

//UPDATE

router.put("/:id", async function(req, res, next) {
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
  const dataOld = await getDataForTable(idFind, "invoices_detail_product").then(
    res => res
  );
  if (dataOld === null) {
    res.send({
      code: 0,
      invoicesMessage: `No invoice product with id ${idFind}`,
      debugMessage: "Found no invoice product",
      data: ""
    });
    return;
  }
  //id_product
  let id_product = isNaN(parseInt(req.body.id_product))
    ? null
    : parseInt(req.body.id_product);
  if (id_product !== null) {
    try {
      const result = await isCorrectId(id_product, "products")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        id_product = null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  let id_invoice = isNaN(parseInt(req.body.id_invoice))
    ? null
    : parseInt(req.body.id_invoice);
  if (id_invoice !== null) {
    try {
      const result = await isCorrectId(id_invoice, "invoices_product")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        id_invoice = null;
      }
    } catch (error) {
      console.log(error);
    }
  }
  let quantity = isNaN(parseInt(req.body.quantity))
    ? dataOld.quantity
    : parseInt(req.body.quantity);
  let prize_product = await getPrizeOfProduct(
    id_product === null ? dataOld.id_product : id_product,
    "products"
  ).then(res => res);
  let total_product = prize_product * quantity * 1000;
  if (id_invoice === null) id_invoice = dataOld.id_invoice;
  if (id_product === null) id_product = dataOld.id_product;
  knex("invoices_detail_product")
    .where({ id: idFind })
    .update({
      id_invoice,
      id_product,
      quantity,
      prize_product,
      total_product
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
      else {
        res.send({
          code: 1,
          invoicesMessage: "A new invoices product has been updated",
          debugMessage: `New invoices product with id ${id} has been updated`,
          data: id
        });
        if (id_invoice !== dataOld.id_invoice)
          updatePrizeTotalForInvoice([id_invoice, dataOld.id_invoice]);
        else updatePrizeTotalForInvoice([id_invoice]);
      }
    });
});

router.del("/:id", async function(req, res, next) {
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
  const item = await getInvoicesDetailProduct(
    idFind,
    "invoices_detail_product"
  ).then(res => res);
  knex("invoices_detail_product")
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
      else {
        res.send({
          code: result,
          invoicesMessage: `A invoice product has been deleted`,
          debugMessage: `A invoice product with id ${idFind} has been deleted`,
          data: ""
        });
        updatePrizeTotalForInvoice([item.id_invoice]);
      }
    });
});

exports.default = router;
