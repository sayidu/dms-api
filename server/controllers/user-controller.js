import jwt from 'jsonwebtoken';

import { User } from '../models';

const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';

module.exports = {
  /**
   * create
   * @desc Creates a user
   * Route: POST: /users
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  create(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((existingUser) => {
        if (existingUser != null) {
          return res.status(409).send({
            message: 'A user with this email already exists!',
          });
        }

        User.create(req.body)
          .then((user) => {
            const token = jwt.sign({
              UserId: user.id,
              RoleId: user.roleId,
            }, secret, {
              expiresIn: 86400,
            });

            const userInfo = {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              roleId: user.roleId,
            };

            return res.status(201).send({
              token,
              message: 'Your registration was succesful',
              expiresIn: 86400,
              userInfo,
            });
          })
          .catch(err => res.status(400).send(err.errors));
      });
  },
  /**
   * update
   * @desc updates a user's details
   * Route: PUT: /users/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  update(req, res) {
    const updateFields = {};

    User.findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((foundUser) => {
      let updateFields = {};
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

      foundUser.update(updateFields)
        .then(updateUser => res.send({
          message: 'Successfully Updated',
          updatedUser: updateUser,
        }));
    });
  },
  /**
   * showUsers
   * @desc gets details for all users
   * Route: GET: /users
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  showUsers(req, res) {
    User.findAll({ attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt', 'roleId'] })
      .then(users => res.send({
        users,
      }));
  },
   /**
   * findaUser
   * @desc gets details for a specific user
   * Route: GET: /users/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  findaUser(req, res) {
    User.findById(req.params.id)
      .then(validUser => res.send({
        validUser,
      }));
  },
  /**
   * delete
   * @desc delete a specific user
   * Route: DELETE: /users/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  delete(req, res) {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((deleteUser) => {
        if (deleteUser === 0) {
          return res.status(404).send({
            message: 'This record was not deleted!',
          });
        }
        return res.send({
          message: 'Successfully Deleted',
        });
      });
  },
  /**
   * login
   * @desc  login as a user
   * Route: POST: /users/login
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((existingUser) => {
      if (existingUser === null) {
        return res.status(404).send({
          message: 'This record does not exists!',
        });
      }
      if (existingUser && existingUser.validatePwd(req.body.password)) {
        const token = jwt.sign({
          UserId: existingUser.id,
          RoleId: existingUser.RoleId,
        }, secret, { expiresIn: 86400 });

        return res.status(200).send({
          token,
          expiresIn: 86400,
          message: 'Welcome to the Document Management System',
        });
      }
      return res.status(401).send({
        message: 'Invalid Password!',
      });
    });
  },
  /**
   * logout
   * @desc  logout as a user
   * Route: POST: /users/logout
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  logout(req, res) {
    return res.status(200).send({
      message: 'Logged out successfully!',
    });
  },
};
