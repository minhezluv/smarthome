const sql = require("./db.js");

// constructor
const powerdevice = function (powerdevice) {
  this.Data = powerdevice.Data;
  this.CustomerDeviceID = powerdevice.CustomerDeviceID;
  this.date = powerdevice.date;
};

powerdevice.create = async (powerdevice) => {
  try {
    console.log("Connected!");
    console.log(powerdevice);
    var con = "INSERT INTO powerdevice (Data,CustomerDeviceID,Date) VALUES ?";
    var values = [powerdevice];
    try {
      sql.query(con, [values], function (err, result) {
        console.log("Number of records inserted: " + result);
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
// function create(powerdevice) {
//   try {

//            console.log("Connected!");
//            console.log(powerdevice);
//            var sql = "INSERT INTO powerdevice (Data,CustomerDeviceID,Date) VALUES ?";
//            var values =[powerdevice] ;
//            try {
//             con.query(sql, [values], function (err, result) {
//               console.log("Number of records inserted: " + result.affectedRows);
//             });
//            } catch (error) {
//             console.log(error);
//            }

//   } catch (error) {
//     console.log(error);
//   }

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
  sql.query(
    `SELECT * FROM powerdevice WHERE CustomerDeviceID = ${id}`,
    (err, res) => {
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
    }
  );
};

powerdevice.getAllpermonth = (CustomerDeviceID, result) => {
  let query =
    "SELECT MONTH(p.Date) AS month, SUM(data) AS DATA FROM powerdevice p";
  if (CustomerDeviceID) {
    query +=
      ` WHERE p.CustomerDeviceID LIKE '${CustomerDeviceID}' ` +
      `AND YEAR(p.Date) = ${2022} ` +
      `GROUP BY month `;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    var string = JSON.stringify(res);
    var json = JSON.parse(string);
    //console.log(json[0]);
    let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i in json) {
      let month = json[i].month;

      temp[month - 1] = json[i].DATA;
    }

    console.log("powerdevice: ", temp);
    result(null, temp);
  });
};
powerdevice.getAllperday = (Payload, result) => {
  let CustomerDeviceID = Payload.CustomerDeviceID;
  let month = Payload.month;
  let query =
    "SELECT DAY(Date) as DayOfMonth,SUM(data) as data  FROM powerdevice";

  if (CustomerDeviceID) {
    query +=
      ` WHERE CustomerDeviceID LIKE '${CustomerDeviceID}'` +
      `AND MONTH(Date) = ${month} AND YEAR(Date)=2022 ` +
      `GROUP BY DAY(Date) `;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    var string = JSON.stringify(res);
    var json = JSON.parse(string);
    console.log(json[0]);
    let temp = new Array(31).fill(0);
    console.log(temp.length);
    for (var i in json) {
      let DayOfMonth = json[i].DayOfMonth;
      temp[DayOfMonth - 1] = json[i].data;
    }
    result(null, temp);
  });
};
module.exports = powerdevice;
