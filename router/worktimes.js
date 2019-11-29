var Router = require("restify-router").Router;
var router = new Router();
const { getDataForTable } = require("../helper/Helper");
let knex = require("../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("worktimes")
    .select("*")
    .then(worktimes => {
      res.send({
        employeesMessage: "List of all worktimes",
        debugMessage: "Successful return ",
        data: { worktimes }
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
  knex("worktimes")
    .where({ id: id })
    .select("*")
    .then(worktimes => {
      if (worktimes.length === 0) {
        res.send({
          code: 0,
          employeesMessage: `No worktime with id ${id}`,
          debugMessage: "Found no worktime",
          data: { worktimes }
        });
      } else
        res.send({
          code: 1,
          employeesMessage: "Found one worktime",
          debugMessage: "Successful return ",
          data: { worktimes }
        });
    });
});

//INSERT

router.post("", async (req, res, next) => {
  try {
    let des = req.body.des ? req.body.des : null;
    let prize = isNaN(parseInt(req.body.prize))
      ? null
      : parseInt(req.body.prize);

    knex
      .insert({
        des,
        prize
      })
      .into("worktimes")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          employeesMessage: "A new worktime has been created",
          debugMessage: `New worktime with id ${id} has been created`,
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
      employeesMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  const dataOld = await getDataForTable(idFind, "worktimes").then(res => res);
  if (dataOld === null) {
    res.send({
      code: 0,
      Message: `No worktime with id ${idFind}`,
      debugMessage: "Found no worktime",
      data: ""
    });
    return;
  }
  let des = req.body.des ? req.body.des : dataOld.des;
  let prize = isNaN(parseInt(req.body.prize))
    ? dataOld.prize
    : parseInt(req.body.prize);
  
  knex("worktimes")
    .where({ id: idFind })
    .update({
      des,
      prize
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        res.send({
          code: 0,
          employeesMessage: `No worktime with id ${idFind}`,
          debugMessage: "Found no worktime",
          data: id
        });
      else
        res.send({
          code: 1,
          employeesMessage: "A new worktime has been updated",
          debugMessage: `New worktime with id ${id} has been updated`,
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

  knex("worktimes")
    .where({ id: idFind })
    .del()
    .then(result => {
      if (result === 0)
        res.send({
          code: result,
          employeesMessage: `No worktime with id ${idFind}`,
          debugMessage: "Found no worktime",
          data: ""
        });
      else
        res.send({
          code: result,
          employeesMessage: `A worktime has been deleted`,
          debugMessage: `A worktime with id ${idFind} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
