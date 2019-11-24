var Router = require("restify-router").Router;
var router = new Router();

let knex = require("../knexData").default;

// ================== SERVICE ==================
//get (read) services
router.get("", (request, response, next) => {
  knex("services")
    .select("*")
    .then(services => {
      response.send({
        code: 1,
        Message: "List of all services",
        Message: "Successfully return",
        data: services
      });
    });
});

//get (read) service by id
router.get("/:id", (request, response, next) => {
  var id = parseInt(request.params.id);

  if (isNaN(id)) {
    response.send({
      code: 0,
      userMessage: "Wrong syntax !",
      debugMessage: "Wrong syntax !",
      data: ""
    });
    return;
  }

  knex("services")
    .where({ id })
    .select("*")
    .then(services => {
      if (services.length === 0) {
        response.send({
          code: 0,
          userMessage: `No service with id ${id} found`,
          debugMessage: "Found no service",
          data: ""
        });
      } else {
        response.send({
          code: 1,
          userMessage: "Found one service",
          debugMessage: "Successfully return",
          data: services[0]
        });
      }
    });
});

//post (create) service
router.post("", (request, response, next) => {
  var name = request.body.name;
  var prize = parseFloat(request.body.prize);

  knex
    .insert({
      name,
      prize
    })
    .into("services")
    .returning("id")
    .then(id => {
      response.send({
        code: 1,
        Message: `A new service with id ${id} has been created`,
        debugMessage: `A new service with id ${id} has been created`,
        data: id
      });
    });
});

//put (update) service
router.put("/:id", (request, response, next) => {
  var foundID = parseInt(request.params.id);
  var name = request.body.name;
  var prize = parseFloat(request.body.prize);

  if (isNaN(foundID)) {
    response.send({
      code: 0,
      Message: "Wrong syntax",
      debugMessage: "Wrong syntax",
      data: ""
    });
    return;
  }

  knex("services")
    .where({ id: foundID })
    .update({
      name,
      prize
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        response.send({
          code: 0,
          Message: `No service with id ${foundID}`,
          debugMessage: "Found no service",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: "A service has been updated",
          debugMessage: `A service with id ${foundID} has been updated`,
          data: foundID
        });
    });
});

//delete (delete) service
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

  knex("services")
    .where({ id: foundID })
    .del()
    .then(result => {
      if (result === 0)
        response.send({
          code: 0,
          Message: `No service with id ${foundID}`,
          debugMessage: "Found no service",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: `A service with id ${foundID} has been deleted`,
          debugMessage: `A service with id ${foundID} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
