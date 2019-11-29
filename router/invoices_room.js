var Router = require("restify-router").Router;
var router = new Router();
const { isCorrectId, getDataForTable } = require("../helper/Helper");
let knex = require("../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("invoices_room")
    .select("*")
    .then(invoices => {
      res.send({
        invoicesMessage: "List of all invoices room",
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
  knex("invoices_room")
    .where({ id: id })
    .select("*")
    .then(invoices => {
      if (invoices.length === 0) {
        res.send({
          code: 0,
          invoicesMessage: `No invoices room with id ${id}`,
          debugMessage: "Found no invoices room",
          data: { invoices }
        });
      } else
        res.send({
          code: 1,
          invoicesMessage: "Found one invoices room",
          debugMessage: "Successful return ",
          data: { invoices }
        });
    });
});

//INSERT

router.post("", async (req, res, next) => {
  try {
    let id_customer = parseInt(req.body.id_customer);
    let id_room = parseInt(req.body.id_room);
    let date_arrival = null;
    let date_department = null;

    let temp = Date.parse(req.body.date_arrival);
    if (!isNaN(temp)) date_arrival = new Date(temp);
    temp = Date.parse(req.body.date_department);
    if (!isNaN(temp)) date_department = new Date(temp);

    let create_at = new Date();
    let total = null;
    let status = req.body.status ? req.body.status : "new";

    if (isNaN(id_customer)) id_customer = null;
    if (id_customer !== null) {
      try {
        const result = await isCorrectId(id_customer, "customers")
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No customer with id ${id_customer}`,
            debugMessage: "Found no customer",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }

    if (isNaN(id_room)) id_room = null;
    if (id_room !== null) {
      try {
        const result = await isCorrectId(id_room, "rooms")
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No room with id ${id_room}`,
            debugMessage: "Found no room",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    knex
      .insert({
        id_customer,
        id_room,
        date_arrival,
        date_department,
        create_at,
        status,
        total
      })
      .into("invoices_room")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          invoicesMessage: "A new invoices room has been created",
          debugMessage: `New invoices room with id ${id} has been created`,
          data: id
        });
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

router.put("/:id", async (req, res, next) => {
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
  const dataOld = await getDataForTable(idFind, "invoices_room").then(
    res => res
  );
  if (dataOld === null) {
    res.send({
      code: 0,
      invoicesMessage: `No  room with id ${idFind}`,
      debugMessage: "Found no room",
      data: ""
    });
    return;
  }

  let id_customer = parseInt(req.body.id_customer);
  let id_room = parseInt(req.body.id_room);
  let date_arrival = null;
  let date_department = null;
  let status = req.body.status ? req.body.status : dataOld.status;

  let temp = Date.parse(req.body.date_arrival);
  if (!isNaN(temp)) date_arrival = new Date(temp);
  else date_arrival = dataOld.date_arrival;

  temp = Date.parse(req.body.date_department);
  if (!isNaN(temp)) date_department = new Date(temp);
  else date_department = dataOld.date_department;

  if (isNaN(id_customer)) id_customer = null;
  if (id_customer !== null) {
    try {
      const result = await isCorrectId(id_customer, "customers")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No customer with id ${id_customer}`,
          debugMessage: "Found no customer",
          data: ""
        });
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (isNaN(id_room)) id_room = null;
  if (id_room !== null) {
    try {
      const result = await isCorrectId(id_room, "rooms")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No room with id ${id_room}`,
          debugMessage: "Found no room",
          data: ""
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (id_room === null) id_room = dataOld.id_room;
  if (id_customer === null) id_room = dataOld.id_customer;

  knex("invoices_room")
    .where({ id: idFind })
    .update({
      id_customer,
      id_room,
      date_arrival,
      date_department,
      status,
      total: dataOld.total
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          invoicesMessage: `No  room with id ${idFind}`,
          debugMessage: "Found no room",
          data: id
        });
      else
        res.send({
          code: 1,
          invoicesMessage: "A new invoices room has been updated",
          debugMessage: `New invoices room with id ${id} has been updated`,
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

  knex("invoices_room")
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
      else
        res.send({
          code: result,
          invoicesMessage: `A invoice room has been deleted`,
          debugMessage: `A invoice room with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
