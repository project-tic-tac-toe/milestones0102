var Router = require("restify-router").Router;
var router = new Router();
const {
  isCorrectId,
  getPrizeOfProduct,
  getDataForTable,
  updatePrizeTotalForTransaction
} = require("../helper/Helper");

const knex = require("../knexData").default;
// {
//     id_transaction:
//     id_worktime:
//     date:
//     total:

// }
//GET
router.get("", (req, res, next) => {
  knex("transactions_detail_employee")
    .select("*")
    .then(invoices => {
      res.send({
        employeeMessage: "List of all transaction detail employee",
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
      employeeMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("transactions_detail_employee")
    .where({ id: id })
    .select("*")
    .then(transactions => {
      if (transactions.length === 0) {
        res.send({
          code: 0,
          employeeMessage: `No transaction detail employee with id ${id}`,
          debugMessage: "Found no transaction detail employee",
          data: { transactions }
        });
      } else
        res.send({
          code: 1,
          employeeMessage: "Found one transaction detail employee",
          debugMessage: "Successful return ",
          data: { transactions }
        });
    });
});

//INSERT

router.post("", async function(req, res, next) {
  //id_worktime
  try {
    //id_worktime
    let id_worktime = isNaN(parseInt(req.body.id_worktime))
      ? null
      : parseInt(req.body.id_worktime);
    if (id_worktime !== null) {
      try {
        const result = await isCorrectId(id_worktime, "worktimes")
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No worktime with id ${id_worktime}`,
            debugMessage: "Found no worktime",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    let id_transaction = isNaN(parseInt(req.body.id_transaction))
      ? null
      : parseInt(req.body.id_transaction);
    if (id_transaction !== null) {
      try {
        const result = await isCorrectId(
          id_transaction,
          "transactions_employee"
        )
          .then(res => res)
          .catch(err => {
            throw new Error(err);
          });
        if (!result) {
          res.send({
            code: 0,
            employeesMessage: `No transactions employee with id ${id_transaction}`,
            debugMessage: "Found no transactions employee",
            data: ""
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    let prize_product =
      id_worktime === null
        ? 0
        : await getPrizeOfProduct(id_worktime, "worktimes").then(res => res);
    let total = prize_product * 1000;
    knex
      .insert({
        id_transaction,
        id_worktime,
        date: new Date(),
        total
      })
      .into("transactions_detail_employee")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          employeeMessage: "A new transaction detail employee has been created",
          debugMessage: `New transaction detail employee with id ${id} has been created`,
          data: id
        });
        updatePrizeTotalForTransaction([id_transaction]);
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
      employeeMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  const dataOld = await getDataForTable(
    idFind,
    "transactions_detail_employee"
  ).then(res => res);
  if (dataOld === null) {
    res.send({
      code: 0,
      employeeMessage: `No transaction employee with id ${idFind}`,
      debugMessage: "Found no transaction employee",
      data: ""
    });
    return;
  }
  //id_worktime
  let id_worktime = isNaN(parseInt(req.body.id_worktime))
    ? null
    : parseInt(req.body.id_worktime);
  if (id_worktime !== null) {
    try {
      const result = await isCorrectId(id_worktime, "worktimes")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        id_worktime = null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  let id_transaction = isNaN(parseInt(req.body.id_transaction))
    ? null
    : parseInt(req.body.id_transaction);
  if (id_transaction !== null) {
    try {
      const result = await isCorrectId(id_transaction, "transactions_employee")
        .then(res => res)
        .catch(err => {
          throw new Error(err);
        });
      if (!result) {
        id_transaction = null;
      }
    } catch (error) {
      console.log(error);
    }
  }
  let prize_product = await getPrizeOfProduct(
    id_worktime === null ? dataOld.id_worktime : id_worktime,
    "worktimes"
  ).then(res => res);

  let total = prize_product * 1000;
  if (id_transaction === null) id_transaction = dataOld.id_transaction;
  if (id_worktime === null) id_worktime = dataOld.id_worktime;
  knex("transactions_detail_employee")
    .where({ id: idFind })
    .update({
      id_transaction,
      id_worktime,
      date: new Date(),
      total
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          employeeMessage: `No transaction with id ${idFind}`,
          debugMessage: "Found no transaction",
          data: id
        });
      else {
        res.send({
          code: 1,
          employeeMessage: "A new transaction employee has been updated",
          debugMessage: `New transaction employee with id ${id} has been updated`,
          data: id
        });
        if (id_transaction !== dataOld.id_transaction)
          updatePrizeTotalForTransaction([
            id_transaction,
            dataOld.id_transaction
          ]);
        else updatePrizeTotalForTransaction([id_transaction]);
      }
    });
});

router.del("/:id", async function(req, res, next) {
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
  const item = await getInvoicesDetailProduct(
    idFind,
    "transactions_detail_employee"
  ).then(res => res);
  knex("transactions_detail_employee")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          employeeMessage: `No transaction  with id ${idFind}`,
          debugMessage: "Found no transaction ",
          data: ""
        });
      else {
        res.send({
          code: result,
          employeeMessage: `A transaction employee has been deleted`,
          debugMessage: `A transaction employee with id ${idFind} has been deleted`,
          data: ""
        });
        updatePrizeTotalForTransaction([item.id_transaction]);
      }
    });
});

exports.default = router;
