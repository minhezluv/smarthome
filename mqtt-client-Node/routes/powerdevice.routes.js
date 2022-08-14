module.exports = (app) => {
  const powerdevice = require("../controllers/powerdevice.controller.js");

  var router = require("express").Router();
  console.log(router);
  // Create a new Tutorial
  // Create a new Tutorial
  router.post("/", powerdevice.create);
  // router.post("/", powerdevice.create);
  // Retrieve a single Tutorial with id
  router.get("/:id", powerdevice.findAll);
  // Retrieve all Tutorials
  router.get("/", powerdevice.findAll);
  //permonth
  router.get("/month/:id", powerdevice.findAllperMonth);
  //perday
  router.get("/day/:id/:month", powerdevice.findAllperday);
  app.use("/api/powerdevice", router);
};
