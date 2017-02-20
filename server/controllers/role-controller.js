const Role = require('../models').Role;


module.exports = {
  create(req, res) {
    Role.create(req.body)
      .then((role) => {
        res.status(201).send({
          message: "New Role Created"
        })
      })
      .catch((err) => {
        res.status(400).send({
          message: "Roles require unique titles."
        })
      })
  },
  all(req,res) {
    Role.findAll({})
      .then((roles) => {
         res.status(200).send({
          message: "Roles Found",
          roles: roles
        })
      })
      .catch((err) => {
        res.status(400).send({
          message: "No Roles found"
        })
      })
  }
}