const powerdevice = require("../models/powerdevice.model.js");

// Create and Save a new powerdevice
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   // Create a electric
//   const electric = new electric({
//     PowerCustomerDeviceID: req.body.PowerCustomerDeviceID,
//     : req.body.power,
//     date: req.body.date || false
//   });

//   // Save electric in the database
//   electric.create(electric, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the electric."
//       });
//     else res.send(data);
//   });
// };



// Retrieve all powerdevices from the database (with condition).
exports.findAll = (req, res) => {
  const CustomerDeviceID = req.query.CustomerDeviceID;

  powerdevice.getAll(CustomerDeviceID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving powerdevices."
      });
    else res.send(data);
    
  });
};
// Retrieve all powerdevices from the database (with condition).
exports.findAllperday = (req, res) => {
  const CustomerDeviceID = req.query.CustomerDeviceID;

  powerdevice.getAllperday(CustomerDeviceID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving powerdevices."
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
          message: `Not found powerdevice with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving powerdevice with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};