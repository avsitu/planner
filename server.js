const express = require("express");

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const sqlite3 = require('sqlite3').verbose();
const db3 = new sqlite3.Database('db/event.sqlite3');
app.get("/users/get", (req, res) => {
  const param = req.query.id;
  db3.all(`select * from user where eventID=?`, [param], (err, rows) => {
    if (err) {
      throw err;
    }
    const result = {};
    rows.forEach((row) => {
      result[row.name] = row.dates==='' ? [] : row.dates.split(',');
    });
    // console.log(result);
    res.json(result);
  });
});

app.get("/users/update", (req, res) => {
  const id = req.query.id, name = req.query.name, dates = req.query.dates;
  db3.run(`update user set dates=? where eventID=? and name=?`, [dates,id,name], function(err) {
    if (err) {
      throw err;
    }
    // console.log(this.lastID);
    // db3.get(`select * from user where rowid=?`,[this.lastID],(err, row) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log(row);
    //   res.json(row);
    // })
  });
});

app.get("/users/add", (req, res) => {
  const id = req.query.id, name = req.query.name;
  db3.get(`select * from user where name=? and eventID=?`, [name,id], (err, row) => {
    if(row)
      res.json("user already exists");
    else {
      db3.run(`INSERT into user (name, dates, eventID) VALUES(?,'',?)`, [name,id], function(err) {
        if (err) {
          throw err;
        }
        // console.log(this.lastID, this.changes);
        // db3.get(`select * from user where rowid=?`,[this.lastID],(err, row) => {
        //   if (err) {
        //     throw err;
        //   }
        //   console.log(row);
        //   res.json(row);
        // })  
      });      
    }
  });

});

app.get("/events/get", (req, res) => {
  db3.all(`select rowid,* from event`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    const result = rows.map((row) => {
      return {name:row.name, id:row.rowid, dates: row.dates.split(',')};
    });
    // console.log(result);
    res.json(result);
  });
});

app.get("/events/add", (req, res) => {
  const name = req.query.name, dates = req.query.dates;
  db3.run(`INSERT into event (name, dates) VALUES(?, ?)`, [name, dates], function(err) {
    if (err) {
      throw err;
    }
    // console.log(this.lastID, this.changes);
    db3.get(`select rowid,* from event where rowid=?`,[this.lastID],(err, row) => {
      if (err) {
        throw err;
      }
      // console.log(row);
      res.json({name:row.name, id:row.rowid, dates: row.dates.split(',')});
    })  
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
