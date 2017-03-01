'use strict';

import jwt from 'jsonwebtoken';
import {
  User,
} from '../models';
const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';

module.exports = {
  /**
   * Creates a user
   * Route: POST: /users
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  create(req, res) {
    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then((existingUser) => {
        if (existingUser != null) {
          return res.status(409).send({
            message: "A user with this email already exists!",
          });
        }

        User.create(req.body)
          .then((user) => {
            const token = jwt.sign({
              UserId: user.id,
              RoleId: user.roleId,
            }, secret, {
              expiresIn: 86400
            });

            const userInfo = {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              password: user.password,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              roleId: user.roleId
            };

            res.status(201).send({
              token,
              expiresIn: 86400,
              userInfo
            });
          })
          .catch((err) => {
            res.status(400).send(err.errors);
          });
      });
  },
  /**
   * updates a user's details
   * Route: UPDATE: /users/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  update(req, res) {
    let updateFields = {};

    User.findOne({
      where: {
        id: req.params.id
      }
    }).
    then((foundUser) => {
      if (foundUser === null) {
        return res.status(404).send({
          message: 'This record does not exists!',
        });
      }

      if (req.body.firstName) {
        updateFields.firstName = req.body.firstName;
      }

      if (req.body.lastName) {
        updateFields.lastName = req.body.lastName;
      }

      User.update(updateFields, {
          where: {
            id: req.params.id
          }
        })
        .then((updateUser) => {
          res.status(201).send({
            message: 'Your details have beeen updated'
          });
        });
    });
  },
  /**
   * gets all user's details
   * Route: UPDATE: /users/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  showUsers(req, res) {
    User.findAll()
      .then((users) => {
        res.status(200).send({
          users
        });
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
          return res.status(200).send({
            message: "This record was not deleted!",
          });
        }
        res.status(201).send({
          message: "User deleted",
        })
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
        return res.status(200).send({
          message: "This record does not exists!",
        });
      }
      if (existingUser.validatePwd(req.body.password) && existingUser) {
        res.status(200).send({
          message: 'Welcome to the Document Management System'
        })
      } else {
        res.status(401).send({
          message: 'Invalid Password!'
        })
      }
    });
  },
  logout(req, res) {
    res.status(200).send({
      message: 'You have been logged out successfully!'
    })
  }
}
