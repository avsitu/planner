const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");

const filebuffer = fs.readFileSync("db/usda-nnd.sqlite3");

const db = new sqlite.Database(filebuffer);

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const COLUMNS = [
  "carbohydrate_g",
  "protein_g",
  "fa_sat_g",
  "fa_mono_g",
  "fa_poly_g",
  "kcal",
  "description"
];
app.get("/api/food", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.exec(
    `
    select ${COLUMNS.join(", ")} from entries
    where description like '%${param}%'
    limit 100
  `
  );

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (parseFloat(e.fat_g, 10) +
              parseFloat(entry[idx], 10)).toFixed(2);
          } else {
            e[c] = entry[idx];
          }
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});

const sqlite3 = require('sqlite3').verbose();
const db3 = new sqlite3.Database('db/event.sqlite3');
app.get("/users/get", (req, res) => {
  db3.all(`select * from user where eventID=1`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    const result = {};
    rows.forEach((row) => {
      result[row.name] = row.dates.split(',');
    });
    console.log(result);
    res.json(result);
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
  db3.run(`INSERT into event (name, dates) VALUES('event3', '1-1,1-2')`, [], function(err) {
    if (err) {
      throw err;
    }
    // console.log(this.lastID, this.changes);
    db3.get(`select * from event where rowid=?`,[this.lastID],(err, row) => {
      if (err) {
        throw err;
      }
      console.log(row);
      res.json(row);
    })  
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
