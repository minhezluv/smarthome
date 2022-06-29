module.exports = app => {
  const powerdevice = require("../controllers/powerdevice.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
 // router.post("/", powerdevice.create);
   // Retrieve a single Tutorial with id
   router.get("/:id", powerdevice.findAll);
 // Retrieve all Tutorials
 router.get("/", powerdevice.findAll);
 //perday
 router.get("/month/:id", powerdevice.findAllperday);
  app.use('/api/powerdevice', router);
};
