const restify = require("restify");

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var employeesRouter = require('./router/employees').default;
var productsRouter = require('./router/products').default;

server.get("/", (req, res, next) => {
  res.send({
    Message: "Hello, you connect success, I am server !!!"
  });
});

employeesRouter.applyRoutes(server,"/employees");
productsRouter.applyRoutes(server,"/products");

server.listen(process.env.PORT || 1299, () => {
  console.log(`${server.name} is listen at ${server.url}`);
});
