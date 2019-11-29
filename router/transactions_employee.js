var Router = require("restify-router").Router;
var router = new Router();
const { isCorrectId, getDataForTable } = require("../helper/Helper");
let knex = require("../knexData").default;

router.get("", (req, res, next) => {
  knex("transactions_employee")
    .select("*")
    .then(transactions => {
      res.send({
        employeeMessage: "List of all transaction employee",
        debugMessage: "Successful return ",
        data: { transactions }
      });
    });
});

router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.send({
      code: 0,
      employeeMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("transactions_employee")
    .where({ id: id })
    .select("*")
    .then(transactions => {
      if (transactions.length === 0) {
        res.send({
          code: 0,
          employeeMessage: `No transaction employee with id ${id}`,
          debugMessage: "Found no transaction employee",
          data: { transactions }
        });
      } else
        res.send({
          code: 1,
          employeeMessage: "Found one transaction employee",
          debugMessage: "Successful return ",
          data: { transactions }
        });
    });
});

//INSERT

router.post("", async (req, res, next) => {
  let create_at = new Date();
  let total = null;

  
  let id_employee = isNaN(parseInt(req.body.id_employee))
    ? null
    : parseInt(req.body.id_employee);
  if (id_employee !== null) {
    try {
      const result = await isCorrectId(id_employee, "employees")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No employee with id ${id_employee}`,
          debugMessage: "Found no employee",
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
      id_employee,
      create_at,
      total
    })
    .into("transactions_employee")
    .returning("id")
    .then(id => {
      res.send({
        code: 1,
        employeeMessage: "A new transaction employee has been created",
        debugMessage: `New transaction employee with id ${id} has been created`,
        data: id
      });
    });
});

//UPDATE

router.put("/:id", async (req, res, next) => {
  let idFind = parseInt(req.params.id);

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      employeeMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  let id_employee = isNaN(parseInt(req.body.id_employee))
    ? null
    : parseInt(req.body.id_employee);
  if (id_employee !== null) {
    try {
      const result = await isCorrectId(id_employee, "employees")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        res.send({
          code: 0,
          employeesMessage: `No employee with id ${id_employee}`,
          debugMessage: "Found no employee",
          data: ""
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
  const dataOld = await getDataForTable(idFind, "transactions_employee").then(
    res => res
  );
  if (dataOld === null) {
    res.send({
      code: 0,
      employeeMessage: `No invoice product with id ${idFind}`,
      debugMessage: "Found no invoice product",
      data: ""
    });
    return;
  }
  if (id_employee === null) id_employee = dataOld.id_employee;
  knex("transactions_employee")
    .where({ id: idFind })
    .update({
      id_employee
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          employeeMessage: `No invoice product with id ${idFind}`,
          debugMessage: "Found no invoice product",
          data: id
        });
      else
        res.send({
          code: 1,
          employeeMessage: "A new transaction employee has been updated",
          debugMessage: `New transaction employee with id ${id} has been updated`,
          data: id
        });
    });
});

router.del("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      employeeMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("transactions_employee")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          employeeMessage: `No invoice product with id ${idFind}`,
          debugMessage: "Found no invoice product",
          data: ""
        });
      else
        res.send({
          code: result,
          employeeMessage: `A invoice product has been deleted`,
          debugMessage: `A invoice product with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
