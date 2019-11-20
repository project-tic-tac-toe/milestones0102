var Router = require('restify-router').Router;
var router= new  Router();

let knex=require("../knexData2").default;


// ================== ROOM ==================
//get (read) rooms
router.get('', (request, response, next) => {
    knex('Phong').select('*').then (Phongs => {
        response.send({
            code: 1,
            Message: "List of all rooms",
            Message: "Successfully return",
            data: Phongs
        });
    });
  });
  
  //get (read) room by id
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
  
    knex('Phong').where({MaPhong: id}).select('*').then (Phongs => {
        if (Phongs.length == 0){
        response.send({
            code: 0,
            userMessage: `No room with id ${id} found`,
            debugMessage: "Found no room",
            data: ""
        });
        }
        else{
            response.send({
                code: 1,
                userMessage: "Found one room",
                debugMessage: "Successfully return",
                data: Phongs[0]
                
        });
    }
        
        // response.send({
        //     code: 1,
        //     userMessage: "List of all Phongs",
        //     debugMessage: "Return successfully",
        //     data: Phongs
        // });
    });
  
    
  });
  
  //post (create) room
  router.post('', (request, response, next) => {
    var MaPhong = parseInt(request.body.MaPhong);
    var TenPhong = request.body.TenPhong;
    var MieuTa = request.body.MieuTa;
    var Gia = parseFloat(request.body.Gia);
    var TinhTrang = request.body.TinhTrang;
    var HinhAnh = request.body.HinhAnh;
  
    knex
    .insert({
        MaPhong,
        TenPhong,
        MieuTa,
        Gia,
        TinhTrang,
        HinhAnh
    })
    .into("Phong")
    .then(MaPhong => {
        response.send({
            code: 1,
            Message: "A new room has been created",
            debugMessage: `New room with id ${MaPhong} has been created`,
            data: MaPhong
        });
    });
  });
  
  //put (update) room
  router.put("/:id", (request, response, next) => {
    var foundID = parseInt(request.params.id);
    var TenPhong = request.body.TenPhong;
    var MieuTa = request.body.MieuTa;
    var Gia = parseFloat(request.body.Gia);
    var TinhTrang = request.body.TinhTrang;
    var HinhAnh = request.body.HinhAnh;
  
    if (isNaN(foundID)) {
        response.send({
        code: 0,
        Message: "Wrong syntax",
        debugMessage: "Wrong syntax",
        data: ""
      });
      return;
    }
  
    knex("Phong")
        .where({ MaPhong: foundID })
        .update({
            TenPhong,
            MieuTa,
            Gia,
            TinhTrang,
            HinhAnh
      }).then(id => {
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
                debugMessage: `A room with id ${foundID} has been updated`,
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
  
    knex("Phong")
    .where({ MaPhong: foundID })
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

  exports.default=router