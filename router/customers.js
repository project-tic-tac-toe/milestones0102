
var Router = require('restify-router').Router;
var router= new  Router();

let knex=require("../knexData2").default;

// ================== CUSTOMER ==================
//get (read) customers
router.get('', (request, response, next) => {
    knex('KhachHang').select('*').then (KhachHangs => {
        response.send({
            code: 1,
            Message: "List of all customers",
            Message: "Successfully return",
            data: KhachHangs
        });
    });
  });
  
  //get (read) customer by id
  router.get('/:id', (request, response, next) => {
    var id = request.params.id;
    
    if (isNaN(id)){
        response.send({
            code: 0,
            userMessage: "Wrong syntax !",
            debugMessage: "Wrong syntax !",
            data: ""
        });
        return;
    };
  
    knex('KhachHang').where({CMND: id}).select('*').then (KhachHangs => {
        if (KhachHangs.length == 0){
            response.send({
                code: 0,
                userMessage: `No customer with id ${id} found`,
                debugMessage: "Found no customer",
                data: ""
        });
        }
        else{
            response.send({
                code: 1,
                userMessage: "Found one customer",
                debugMessage: "Successfully return",
                data: KhachHangs[0]
        });
    }
    });
  });
  
  //post (create) customer
  router.post('', (request, response, next) => {
    var CMND = request.body.CMND;
    var HoTen = request.body.HoTen;
  
    var Nam = parseInt(request.body.Nam);
    var Thang = parseInt(request.body.Thang);
    var Ngay = parseInt(request.body.Ngay);
    var NgaySinh = new Date(Nam, Thang, Ngay);
  
    var GioiTinh = request.body.GioiTinh;
    var SDT = request.body.SDT;
    var Email = request.body.Email;
  
    knex
    .insert({
        CMND,
        HoTen,
        NgaySinh,
        GioiTinh,
        SDT,
        Email
    })
    .into("KhachHang")
    .then(id => {
        response.send({
            code: 1,
            Message: "A new customer has been created",
            debugMessage: `New customer with id card ${CMND} has been created`,
            data: CMND
        });
    });
  });
  
  //put (update) customer
  router.put("/:id", (request, response, next) => {
    var foundID = parseInt(request.params.id);
    var HoTen = request.body.HoTen;
  
    var Nam = parseInt(request.body.Nam);
    var Thang = parseInt(request.body.Thang);
    var Ngay = parseInt(request.body.Ngay);
    var NgaySinh = new Date(Nam, Thang, Ngay);
  
    var GioiTinh = request.body.GioiTinh;
    var SDT = request.body.SDT;
    var Email = request.body.Email;
  
    if (isNaN(foundID)) {
        response.send({
        code: 0,
        Message: "Wrong syntax",
        debugMessage: "Wrong syntax",
        data: ""
      });
      return;
    }
  
    knex("KhachHang")
        .where({ CMND: foundID })
        .update({
            HoTen,
            NgaySinh,
            GioiTinh,
            SDT,
            Email
      }).then(id => {
        if (id.length === 0)
            response.send({
                code: 0,
                Message: `No customer with id card ${foundID}`,
                debugMessage: "Found no customer",
                data: ""
          });
        else
            response.send({
                code: 1,
                Message: "A customer has been updated",
                debugMessage: `A customer with id card ${foundID} has been updated`,
                data: foundID
            });
      });
  });
  
  //delete (delete) room
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
  
    knex("KhachHang")
    .where({ CMND: foundID })
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
  
  exports.default=router