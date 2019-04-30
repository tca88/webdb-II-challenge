const knex = require("knex");
const router = require("express").Router();

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true,
  debug: true
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("bears") // select * from rows
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/:id", (req, res) => {
  // retrieve a role by id
  db("bears")
    .where({ id: req.params.id })
    .first() // select * from rows
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // insert into roles () values (req.body)
  db("bears")
    .insert(req.body, ["id"]) //always put id as second argument
    .then(ids => {
      return db("bears")
        .where({ id: ids[0] })
        .first() // select * from rows
        .then(bear => {
          res.status(200).json(bear); // adding .first will prevent results from being an object inside of an array.
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} updated`
        });
      } else {
        res.status(404).json({ message: "Bear does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} deleted`
        });
      } else {
        res.status(404).json({ message: "Bear does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
