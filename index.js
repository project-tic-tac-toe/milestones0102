const restify = require("restify");

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var employeesRouter = require('./router/employees').default;
var productsRouter = require('./router/products').default;

var customersRouter = require('./router/customers').default;
var roomsRouter = require('./router/rooms').default;
var servicesRouter = require('./router/services').default;


server.get("/", (req, res, next) => {
  res.send({
    Message: "Hello, you connect success, I am server !!!"
  });
});

employeesRouter.applyRoutes(server,"/employees");
productsRouter.applyRoutes(server,"/products");

customersRouter.applyRoutes(server,"/customers");
roomsRouter.applyRoutes(server,"/rooms");
servicesRouter.applyRoutes(server,"/services");

server.listen(process.env.PORT || 1299, () => {
  console.log(`${server.name} is listen at ${server.url}`);
});
