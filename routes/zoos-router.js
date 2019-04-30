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
  db("zoos") // select * from rows
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/:id", (req, res) => {
  // retrieve a role by id
  db("zoos")
    .where({ id: req.params.id })
    .first() // select * from rows
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
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
  db("zoos")
    .insert(req.body, ["id"]) //always put id as second argument
    .then(ids => {
      return db("zoos")
        .where({ id: ids[0] })
        .first() // select * from rows
        .then(zoo => {
          res.status(200).json(zoo); // adding .first will prevent results from being an object inside of an array.
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
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} updated`
        });
      } else {
        res.status(404).json({ message: "Zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} deleted`
        });
      } else {
        res.status(404).json({ message: "Zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
