var Router = require("restify-router").Router;
var router = new Router();
const {
  isCorrectId,
  getDataForTable,
  getPrizeOfProduct,
  updatePrizeTotalForInvoiceRoom
} = require("../helper/Helper");

const knex = require("../knexData").default;

//GET
router.get("", (req, res, next) => {
  knex("invoices_detail_room")
    .select("*")
    .then(invoices => {
      res.send({
        invoicesMessage: "List of all invoices detail room",
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
  knex("invoices_detail_room")
    .where({ id: id })
    .select("*")
    .then(invoices => {
      if (invoices.length === 0) {
        res.send({
          code: 0,
          invoicesMessage: `No invoices detail room with id ${id}`,
          debugMessage: "Found no invoices detail room",
          data: { invoices }
        });
      } else
        res.send({
          code: 1,
          invoicesMessage: "Found one invoices detail room",
          debugMessage: "Successful return ",
          data: { invoices }
        });
    });
});

//INSERT

router.post("", async function(req, res, next) {
  //id_product
  if (!req.body.id_service || !req.body.id_invoice) {
    res.send({
      code: 0,
      employeesMessage: "Not enough data fields",
      debugMessage: "Not enough data fields",
      data: ""
    });
    return;
  }
  let id_service = isNaN(parseInt(req.body.id_service))
    ? null
    : parseInt(req.body.id_service);
  if (id_service !== null) {
    try {
      const result = await isCorrectId(id_service, "services")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No service with id ${id_service}`,
          debugMessage: "Found no service",
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
      const result = await isCorrectId(id_invoice, "invoices_room")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No invoice room with id ${id_invoice}`,
          debugMessage: "Found no invoice room",
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
  let prize_service = id_service === null ? 0 : await getPrizeOfProduct(id_service,"services").then(res => res);

  let total_room = prize_service * quantity * 1000;
  knex
    .insert({
      id_service,
      id_invoice,
      quantity,
      prize_service,
      total_room
    })
    .into("invoices_detail_room")
    .returning("id")
    .then(id => {
      res.send({
        code: 1,
        invoicesMessage: "A new invoices detail room has been created",
        debugMessage: `New invoices detail room with id ${id} has been created`,
        data: id
      });
      updatePrizeTotalForInvoiceRoom([id_invoice]);
    });
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
  const dataOld = await getDataForTable(idFind, "invoices_detail_room").then(
    res => res
  );
  if (dataOld === null) {
    res.send({
      code: 0,
      invoicesMessage: `No invoice detail room with id ${idFind}`,
      debugMessage: "Found no invoice detail room",
      data: ""
    });
    return;
  }
  let id_service = isNaN(parseInt(req.body.id_service))
    ? null
    : parseInt(req.body.id_service);
  if (id_service !== null) {
    try {
      const result = await isCorrectId(id_service, "services")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) id_service = null;
    } catch (error) {
      console.log(error);
    }
  }

  let id_invoice = isNaN(parseInt(req.body.id_invoice))
    ? null
    : parseInt(req.body.id_invoice);
  if (id_invoice !== null) {
    try {
      const result = await isCorrectId(id_invoice, "invoices_room")
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
  let prize_service = await getPrizeOfProduct(
    id_service === null ? dataOld.id_service : id_service,
    "services"
  ).then(res => res);
  let total_room = prize_service * quantity * 1000;
  if (id_invoice === null) id_invoice = dataOld.id_invoice;
  if (id_service === null) id_service = dataOld.id_service;
  knex("invoices_detail_room")
    .where({ id: idFind })
    .update({
      id_service,
      id_invoice,
      quantity,
      prize_service,
      total_room
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          invoicesMessage: `No  room with id ${idFind}`,
          debugMessage: "Found no room",
          data: ""
        });
      else {
        res.send({
          code: 1,
          invoicesMessage: "A new invoices room has been updated",
          debugMessage: `New invoices room with id ${id} has been updated`,
          data: id
        });
        if (id_invoice !== dataOld.id_invoice)
          updatePrizeTotalForInvoiceRoom([id_invoice, dataOld.id_invoice]);
        else updatePrizeTotalForInvoiceRoom([id_invoice]);
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
  const item = await getDataForTable(idFind, "invoices_detail_room").then(
    res => res
  );
  knex("invoices_detail_room")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          invoicesMessage: `No invoice room with id ${idFind}`,
          debugMessage: "Found no invoice room",
          data: ""
        });
      else {
        res.send({
          code: result,
          invoicesMessage: `A invoice room has been deleted`,
          debugMessage: `A invoice room with id ${idFind} has been deleted`,
          data: ""
        });
        updatePrizeTotalForInvoiceRoom([item.id_invoice]);
      }
    });
});

exports.default = router;
