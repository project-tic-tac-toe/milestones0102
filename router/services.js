var Router = require('restify-router').Router;
var router= new  Router();

let knex=require("../knexData2").default;


// ================== SERVICE ==================
//get (read) services
router.get('', (request, response, next) => {
    knex('DichVu').select('*').then (DichVus => {
        response.send({
            code: 1,
            Message: "List of all services",
            Message: "Successfully return",
            data: DichVus
        });
    });
  });
  
  //get (read) service by id
  router.get('/:id', (request, response, next) => {
    var id = parseInt(request.params.id);
    
    if (isNaN(id)){
        response.send({
            code: 0,
            userMessage: "Wrong syntax !",
            debugMessage: "Wrong syntax !",
            data: ""
        });
        return;
    };
  
    knex('DichVu').where({MaDichVu: id}).select('*').then (DichVus => {
        if (DichVus.length === 0){
            response.send({
                code: 0,
                userMessage: `No service with id ${id} found`,
                debugMessage: "Found no service",
                data: ""
        });
        }
        else{
            response.send({
                code: 1,
                userMessage: "Found one service",
                debugMessage: "Successfully return",
                data: DichVus[0]
        });
    }
    });
  });
  
  //post (create) service
  router.post('', (request, response, next) => {
    var MaDichVu = parseInt(request.body.MaDichVu);
    var TenDichvu = request.body.TenDichvu;
    var Gia = parseFloat(request.body.Gia);
  
    knex
    .insert({
        MaDichVu,
        TenDichvu,
        Gia
    })
    .into("DichVu")
    .then( id => {
        response.send({
            code: 1,
            Message: `A new service with id ${MaDichVu} has been created`,
            debugMessage: `A new service with id ${MaDichVu} has been created`,
            data: id
        });
    });
  });
  
  //put (update) service
  router.put("/:id", (request, response, next) => {
    var foundID = parseInt(request.params.id);
    var TenDichvu = request.body.TenPhong;
    var Gia = parseFloat(request.body.Gia);
  
    if (isNaN(foundID)) {
        response.send({
            code: 0,
            Message: "Wrong syntax",
            debugMessage: "Wrong syntax",
            data: ""
      });
      return;
    }
  
    knex("DichVu")
        .where({ MaDichVu: foundID })
        .update({
            TenDichvu,
            Gia
      }).then(id => {
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
  router.del('/:id', (request, response, next) => {
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
  
    knex("DichVu")
    .where({ MaDichVu: foundID })
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
  

  exports.default=router