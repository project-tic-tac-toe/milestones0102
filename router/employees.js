var Router = require("restify-router").Router;
var router = new Router();

let knex = require("../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("employees")
    .select("*")
    .then(employees => {
      res.send({
        employeesMessage: "List of all employees",
        debugMessage: "Successful return ",
        data: { employees }
      });
    });
});

router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.send({
      code: 0,
      employeesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("employees")
    .where({ id: id })
    .select("*")
    .then(employees => {
      if (employees.length === 0) {
        res.send({
          code: 0,
          employeesMessage: `No employee with id ${id}`,
          debugMessage: "Found no employee",
          data: { employees }
        });
      } else
        res.send({
          code: 1,
          employeesMessage: "Found one employee",
          debugMessage: "Successful return ",
          data: { employees }
        });
    });
});

//INSERT

router.post("", (req, res, next) => {
  try {
    let name = req.body.name;
    let tel = req.body.tel;

    knex
      .insert({
        name,
        tel
      })
      .into("employees")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          employeesMessage: "A new employee has been created",
          debugMessage: `New employee with id ${id} has been created`,
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

router.put("/:id",async (req, res, next) => {
  let idFind = parseInt(req.params.id);
  if (isNaN(idFind)) {
    res.send({
      code: 0,
      employeesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  const dataOld = await getDataForTable(idFind, "employees").then(res => res);
  if (dataOld === null) {
    res.send({
      code: 0,
      Message: `No employee with id ${idFind}`,
      debugMessage: "Found no employee",
      data: ""
    });
    return;
  }
  let name = req.body.name?req.body.name:dataOld.name;
  let tel = req.body.tel?req.body.tel:dataOld.tel;

  knex("employees")
    .where({ id: idFind })
    .update({
      name,
      tel
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          employeesMessage: `No employee with id ${idFind}`,
          debugMessage: "Found no employee",
          data: id
        });
      else
        res.send({
          code: 1,
          employeesMessage: "A new employee has been updated",
          debugMessage: `New employee with id ${id} has been updated`,
          data: id
        });
    });
});

router.del("/:id", (req, res, next) => {
  let idFind = parseInt(req.params.id);

  if (isNaN(idFind)) {
    res.send({
      code: 0,
      employeesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }

  knex("employees")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          employeesMessage: `No employee with id ${idFind}`,
          debugMessage: "Found no employee",
          data: ""
        });
      else
        res.send({
          code: result,
          employeesMessage: `A employee has been deleted`,
          debugMessage: `A employee with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
