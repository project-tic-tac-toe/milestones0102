var restify = require('restify');

var server = restify.createServer();
server.use(restify.plugins.bodyParser());


var knex = require('knex')({
    client: 'postgres',
    connection: {
      host : 'ec2-54-243-44-102.compute-1.amazonaws.com',
      user : 'rklgfxjoiyfhrx',
      password : 'a5816f7ebf85e8d90458e2042df6d617e127d41de74801ed322255778026e06f',
      database : 'd8dnhd2ab6t24a',
      ssl: true
    }
});


// ================== ROOM ==================
//get (read) rooms
server.get('/rooms', (request, response, next) => {
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
server.get('/rooms/:id', (request, response, next) => {
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
server.post('/rooms', (request, response, next) => {
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
server.put("/rooms/:id", (request, response, next) => {
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
server.del('/rooms/:id', (request, response, next) => {
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

// ================== SERVICE ==================
//get (read) services
server.get('/services', (request, response, next) => {
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
server.get('/services/:id', (request, response, next) => {
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
server.post('/services', (request, response, next) => {
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
server.put("/services/:id", (request, response, next) => {
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
server.del('/services/:id', (request, response, next) => {
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

// ================== CUSTOMER ==================
//get (read) customers
server.get('/customers', (request, response, next) => {
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
server.get('/customers/:id', (request, response, next) => {
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
server.post('/customers', (request, response, next) => {
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
server.put("/customers/:id", (request, response, next) => {
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
server.del('/customers/:id', (request, response, next) => {
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

server.listen(8000, () => {
    console.log(`${server.name} is listening at ${server.url}`);
});