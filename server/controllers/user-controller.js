const jwt = require('jsonwebtoken');
const User = require('../models').User;
const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';

module.exports = {
  create(req, res) {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).
    then((existingUser) => {
      if (existingUser != null) {
        return res.status(409).send({
          message: "A user with this email already exists!",
        });
      }

      User.create(req.body)
        .then((user) => {
          const token = jwt.sign({
            UserId: user.id,
          }, secret, {
            expiresIn: 86400
          });

          users = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            RoleId: user.RoleId
          };

          res.status(201).send({
            token,
            expiresIn: 86400,
            users
          });
        })
        .catch((err) => {
          res.status(400).send(err.errors);
        });
    });
  },
  update(req, res) {
    User.findOne({
      where: {
        id: req.params.id
      }
    }).
    then((foundUser) => {
      if (foundUser === null) {
        return res.status(204).send({
          message: "This record does not exists!",
        });
      }

      User.update({
          firstname: req.body.firstName,
          lastname: req.body.lastName
        }, {
          where: {
            id: req.params.id
          }
        })
        .then((updateUser) => {
          res.status(201).send({
            message: 'Your details have beeen updated'
          });
        })
        .catch((err) => {
          res.status(400).send(err.errors);
        });
    })
  },
  showUsers(req, res) {
    User.findAll({})
      .then((users) => {
        res.status(201).send({
          users
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  },
  findaUser(req, res) {
    User.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((validUser) => {
        res.status(201).send({
          validUser
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  delete(req, res) {
    User.destroy({
        where: {
          id: req.params.id
        }
      })
      .then((deleteUser) => {
        if (deleteUser === 0) {
          return res.status(409).send({
            message: "This record was not deleted!",
          });
        }
        res.status(201).send({
          message: "User deleted",
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).
    then((existingUser) => {
        if (existingUser === null) {
          return res.status(204).send({
            message: "This record does not exists!",
          });
        }
        if (existingUser.validatePwd(req.body.password) && existingUser) {
          res.status(200).send({
            message: 'Password Validated!'
          })
        }else{
          res.status(409).send({
            message: 'Invalid Password!'
          })
        }
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  logout(req, res) {
    res.status(200).send({
      message: 'You have been logged out successfully!'
    })
  }
}