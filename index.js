const restify = require("restify");
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

const employeesRouter = require('./router/employees').default;
const productsRouter = require('./router/products').default;
const invoicesProductRouter = require('./router/invoices_product').default;
const invoicesDetailProductRouter = require('./router/invoices_detail_product').default;

const customersRouter = require('./router/customers').default;
const roomsRouter = require('./router/rooms').default;
const servicesRouter = require('./router/services').default;
const invoicesRoomRouter = require('./router/invoices_room').default;
const invoicesDetailRoomRouter = require('./router/invoices_detail_room').default;

server.get("/", (req, res, next) => {
  res.send({
    Message: "Hello, you connect success, I am server !!!"
  });
});

employeesRouter.applyRoutes(server,"/employees");
productsRouter.applyRoutes(server,"/products");
invoicesProductRouter.applyRoutes(server,"/invoices-product");
invoicesDetailProductRouter.applyRoutes(server,"/invoices-detail-product");

customersRouter.applyRoutes(server,"/customers");
roomsRouter.applyRoutes(server,"/rooms");
servicesRouter.applyRoutes(server,"/services");
invoicesRoomRouter.applyRoutes(server,"/invoices-room");
invoicesDetailRoomRouter.applyRoutes(server,"/invoices-detail-room");

server.listen(process.env.PORT || 1299, () => {
  console.log(`${server.name} is listen at ${server.url}`);
});
