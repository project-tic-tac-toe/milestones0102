var Router = require("restify-router").Router;
var router = new Router();

let knex = require("../knexData").default;

// ================== ROOM ==================
//get (read) rooms
router.get("", (request, response, next) => {
  knex("rooms")
    .select("*")
    .then(rooms => {
      response.send({
        code: 1,
        Message: "List of all rooms",
        Message: "Successfully return",
        data: rooms
      });
    });
});

//get (read) room by id
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

  knex("rooms")
    .where({ id: id })
    .select("*")
    .then(rooms => {
      if (rooms.length == 0) {
        response.send({
          code: 0,
          userMessage: `No room with id ${id} found`,
          debugMessage: "Found no room",
          data: ""
        });
      } else {
        response.send({
          code: 1,
          userMessage: "Found one room",
          debugMessage: "Successfully return",
          data: rooms[0]
        });
      }
    });
});

//post (create) room
router.post("", (request, response, next) => {
  try {
    var name = request.body.name;
    var des = request.body.des;
    var prize = parseFloat(request.body.prize);
    var status = request.body.status;
    var image = request.body.image;

    if (isNaN(prize)) prize = null;

    knex
      .insert({
        name,
        des,
        prize,
        status,
        image
      })
      .into("rooms")
      .returning("id")
      .then(id => {
        response.send({
          code: 1,
          Message: "A new room has been created",
          debugMessage: `New room with id ${id} has been created`,
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

//put (update) room
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
  const dataOld = await getDataForTable(foundID, "rooms").then(res => res);
  if (dataOld === null) {
    response.send({
      code: 0,
      Message: `No room with id ${foundID}`,
      debugMessage: "Found no room",
      data: ""
    });
    return;
  }
  var name = request.body.name?request.body.name:dataOld.name;
  var des = request.body.des?request.body.des:dataOld.des;
  var prize = parseFloat(request.body.prize);
  var status = request.body.status?request.body.status:dataOld.status; //true/false
  var image = request.body.image?request.body.image:dataOld.image;

  if (isNaN(prize)) prize = dataOld.prize;

  knex("rooms")
    .where({ id: foundID })
    .update({
      name,
      des,
      prize,
      status,
      image
    })
    .returning("id")
    .then(id => {
      if (id.length === 0)
        response.send({
          code: 0,
          Message: `No room with id ${foundID}`,
          debugMessage: "Found no room",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: "A room has been updated",
          debugMessage: `A room with id ${id} has been updated`,
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

  knex("rooms")
    .where({ id: foundID })
    .del()
    .then(result => {
      if (result === 0)
        response.send({
          code: 0,
          Message: `No room with id ${foundID}`,
          debugMessage: "Found no room",
          data: ""
        });
      else
        response.send({
          code: 1,
          Message: `A room with id ${foundID} has been deleted`,
          debugMessage: `A room with id ${foundID} has been deleted`,
          data: ""
        });
    });
});

exports.default = router;
