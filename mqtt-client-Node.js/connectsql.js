
var mysql = require('mysql');

var config=require('./config/db.config');
var con=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database:"smarthome"
});
async function insertData(datapower) {
        //con.connect(function(err) {
           // if (err) throw err;
            console.log("Connected!");
            console.log(datapower);
            var sql = "INSERT INTO powerdevice (Data,CustomerDeviceID,Date) VALUES ?";
            var values =[datapower] ;
            con.query(sql, [values], function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
            });
         // });

       // con.end(); 
    
}

module.exports={
  insertData:insertData
}

  