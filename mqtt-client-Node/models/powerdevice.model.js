const sql = require("./db.js");

// constructor
const powerdevice = function(powerdevice) {
    this.PowerDeviceID = powerdevice.PowerDeviceID;
    this.Data = powerdevice.Data;
    this.CustomerDeviceID=powerdevice.CustomerDeviceID;
    this.date = powerdevice.date;
  };

  powerdevice.create = (newpowerdevice, result) => {
    try {
      sql.query("INSERT INTO powerdevice SET ?", newpowerdevice, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        console.log("created powerdevice: ", { id: res.insertId, ...newpowerdevice });
        result(null, { id: res.insertId, ...newpowerdevice });
      });
    } catch (error) {
      console.log(error);
    }

  };

  powerdevice.getAll = (CustomerDeviceID, result) => {
    let query = "SELECT * FROM powerdevice";
  
    if (CustomerDeviceID) {
      query += ` WHERE CustomerDeviceID LIKE '${CustomerDeviceID}'`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("powerdevice: ", res);
      result(null, res);
    });
  };

  powerdevice.findById = (id, result) => {
    sql.query(`SELECT * FROM powerdevice WHERE CustomerDeviceID = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found powerdevice: ", res);
        result(null, res[0]);
        return;
      }
  
      // not found powerdevice with the id
      result({ kind: "not_found" }, null);
    });
  };

  
  powerdevice.getAllperday = (CustomerDeviceID, result) => {
    let query = "SELECT * FROM powerdevice";
  
    if (CustomerDeviceID) {
      query += ` WHERE CustomerDeviceID LIKE '${CustomerDeviceID}'`;
    }
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      var string=JSON.stringify(res);
      var json =  JSON.parse(string);
      //console.log(json[0]);
      let temp=[0,0,0,0,0,0,0,0,0,0,0,0];
      for(var i in json ){
        let date =new Date(json[i].Date);
        let month=date.getMonth();
        temp[month]+=json[i].Data;
      }
 
      console.log("powerdevice: ", temp);
      result(null, temp);
    });
  };

  module.exports = powerdevice;