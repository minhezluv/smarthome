const powerdevice = require("../models/powerdevice.model.js");

exports.create = (req, res) => {
  // Validate request
  // if (!req.body) {
  //   // res.status(400).send({
  //   //   message: "Content can not be empty!",
  //   // });
  //   console.log("status");
  // }
  // console.log(res);
  // Create a Tutorial
  const powerdevice = new powerdevice({
    Data: Data,
    CustomerDeviceID: CustomerDeviceID,
    date: date,
  });
  // Save electric in the database
  powerdevice.create(powerdevice, (err) => {
    // if (err)
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the electric.",
    //   });
    // else res.send(data);
    console.log(err);
  });
};

// Retrieve all powerdevices from the database (with condition).
exports.findAll = (req, res) => {
  const CustomerDeviceID = req.query.CustomerDeviceID;
  log(req);
  powerdevice.getAll(CustomerDeviceID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving powerdevices.",
      });
    else res.send(data);
  });
};
// Retrieve all powerdevices from the database (with condition).
exports.findAllperMonth = (req, res) => {
  const CustomerDeviceID = req.params.id;

  powerdevice.getAllpermonth(CustomerDeviceID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving powerdevices.",
      });
    else res.send(data);
  });
};
// Retrieve all powerdevices from the database (with condition).
exports.findAllperday = (req, res) => {
  const CustomerDeviceID = req.params.id;
  const month = req.params.month;
  payload = { CustomerDeviceID: CustomerDeviceID, month: month };
  powerdevice.getAllperday(payload, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving powerdevices.",
      });
    else res.send(data);
  });
};
// Find a single powerdevice by Id
exports.findOne = (req, res) => {
  powerdevice.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found powerdevice with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving powerdevice with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
