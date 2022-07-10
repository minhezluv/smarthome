
var mysql = require('mysql');

var config=require('./config/db.config');
var con=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database:"smarthome"
});
async function insertData(datapower) {
  try {
            
           console.log("Connected!");
           console.log(datapower);
           var sql = "INSERT INTO powerdevice (Data,CustomerDeviceID,Date) VALUES ?";
           var values =[datapower] ;
           try {
            con.query(sql, [values], function (err, result) {
              console.log("Number of records inserted: " + result.affectedRows);
            });
           } catch (error) {
            console.log(error);
           }
       
  } catch (error) {
    console.log(error);
  }

    
}

module.exports={
  insertData:insertData
}

  