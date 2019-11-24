var Router = require("restify-router").Router;
var router = new Router();

let knex = require("../knexData").default;

// ================== CUSTOMER ==================
//get (read) customers
router.get("", (request, response, next) => {
  knex("customers")
    .select("*")
    .then(customers => {
      response.send({
        code: 1,
        Message: "List of all customers",
        Message: "Successfully return",
        data: customers
      });
    });
});

//get (read) customer by id
router.get("/:id", (request, response, next) => {
  var id = request.params.id;

  if (isNaN(id)) {
    response.send({
      code: 0,
      userMessage: "Wrong syntax !",
      debugMessage: "Wrong syntax !",
      data: ""
    });
    return;
  }

  knex("customers")
    .where({ id })
    .select("*")
    .then(customers => {
      if (customers.length == 0) {
        response.send({
          code: 0,
          userMessage: `No customer with id ${id} found`,
          debugMessage: "Found no customer",
          data: ""
        });
      } else {
        response.send({
          code: 1,
          userMessage: "Found one customer",
          debugMessage: "Successfully return",
          data: customers[0]
        });
      }
    });
});

//post (create) customer
router.post("", (request, response, next) => {
  try {
    var cmnd = parseInt(request.body.cmnd);
    var name = request.body.name;

    var year = parseInt(request.body.year);
    var month = parseInt(request.body.month);
    var day = parseInt(request.body.day);
    var birth = new Date(year, month, day);

    if (isNaN(year) || isNaN(month) || isNaN(year)) birth = null;

    var gender = request.body.gender;
    var phone = request.body.phone;
    var email = request.body.email;

    if (isNaN(cmnd)) cmnd = null;

    knex
      .insert({
        cmnd,
        name,
        birth,
        gender,
        phone,
        email
      })
      .into("customers")
      .returning("id")
      .then(id => {
        response.send({
          code: 1,
          Message: "A new customer has been created",
          debugMessage: `New customer with id card ${id} has been created`,
          data: id
        });
      });
  } catch (error) {
    response.send({
      code: 0,
      employeesMessage: "Not enough data fields",
      debugMessage: "Not enough data fields",
      data: ""
    });
  }
});

//put (update) customer
router.put("/:id", async (request, response, next) => {
  var foundID = parseInt(request.params.id);
  if (isNaN(foundID)) {
    response.send({
      code: 0,
      Message: "Wrong syntax",
      debugMessage: "Wrong syntax",
      data: ""
    });
    return;
  }

  const dataOld = await getDataForTable(foundID, "customers").then(res => res);
  if (dataOld === null) {
    response.send({
      code: 0,
      Message: `No customer with id ${foundID}`,
      debugMessage: "Found no customer",
      data: ""
    });
    return;
  }
  var name = request.body.name ? request.body.name : dataOld.name;
  var cmnd = parseInt(Request.body.cmnd);
  if (isNaN(cmnd)) cmnd = dataOld.cmnd;
  var birth = new Date(request.body.birth ? request.body.birth : dataOld.birth);
  var gender = request.body.gender?request.body.gender:dataOld.gender;
  var phone = request.body.phone?request.body.phone:dataOld.phone;
  var email = request.body.email?request.body.email:dataOld.email;

  knex("customers")
    .where({ id: foundID })
    .update({
      cmnd,
      name,
      birth,
      gender,
      phone,
      email
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        response.send({
          code: 0,
          Message: `No customer with id card ${id}`,
          debugMessage: "Found no customer",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: "A customer has been updated",
          debugMessage: `A customer with id card ${id} has been updated`,
          data: id
        });
    });
});

//delete (delete) room
router.del("/:id", (request, response, next) => {
  var foundID = parseInt(request.params.id);

  if (isNaN(foundID)) {
    response.send({
      code: 0,
      Message: "Wrong syntax",
      debugMessage: "Wrong syntax",
      data: ""
    });
    return;
  }

  knex("customers")
    .where({ id: foundID })
    .del()
    .then(result => {
      if (result === 0)
        response.send({
          code: 0,
          Message: `No customer with id card ${foundID}`,
          debugMessage: "Found no customer",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: `A customer with id card ${foundID} has been deleted`,
          debugMessage: `A customer with id ${foundID} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
