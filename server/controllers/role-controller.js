const Role = require('../models').Role;


module.exports = {
  create(req, res) {
    Role.create(req.body)
      .then((role) => {
        res.status(201).send({
          message: "Role Created"
        })
      })
      .catch((err) => {
        res.status(400).send({
          message: "Your role creation request was unsucessful"
        })
      })
  }
}