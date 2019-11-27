var Router = require("restify-router").Router;
var router = new Router();
let knex = require("../knexData").default;
//GET

router.get("", (req, res, next) => {
  knex("recruitments")
    .select("*")
    .then(recruitment => {
      res.send({
        recruitmentsMessage: "List of all recruitments",
        debugMessage: "Successful return ",
        data: { recruitment }
      });
    });
});

router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.send({
      code: 0,
      recruitmentsMessage: "wrong syntax",
      debugMessage: "wrong syntax",
      data: ""
    });
    return;
  }
  knex("recruitments")
    .where({ id: id })
    .select("*")
    .then(recruitments => {
      if (recruitments.length === 0) {
        res.send({
          code: 0,
          recruitmentsMessage: `No recruitment with id ${id}`,
          debugMessage: "Found no recruitment",
          data: { recruitments }
        });
      } else
        res.send({
          code: 1,
          recruitmentsMessage: "Found one recruitment",
          debugMessage: "Successful return ",
          data: { recruitments }
        });
    });
});

//INSERT

router.post("", async (req, res, next) => {
  try {
    let name = req.body.name;
    let tel = req.body.tel;
    let phone = isNaN(parseInt(request.body.phone))
      ? null
      : parseInt(request.body.phone);
    let email = request.body.email;
    let cmnd = isNaN(parseInt(request.body.cmnd))
      ? null
      : parseInt(request.body.cmnd);

    knex
      .insert({
        name,
        tel,
        phone,
        cmnd,
        email
      })
      .into("recruitments")
      .returning("id")
      .then(id => {
        res.send({
          code: 1,
          recruitmentsMessage: "A new recruitment has been created",
          debugMessage: `New recruitment with id ${id} has been created`,
          data: id
        });
      });
  } catch (error) {
    res.send({
      code: 0,
      recruitmentsMessage: "Not enough data fields",
      debugMessage: "Not enough data fields",
      data: ""
    });
  }
});

exports.default = router;
