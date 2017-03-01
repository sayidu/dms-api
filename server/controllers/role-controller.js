'use strict';

import {
  Role
} from '../models';

module.exports = {
  /**
   * Creates a role
   * Route: POST: /roles
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  create(req, res) {
    Role.create(req.body)
      .then((role) => {
        return res.status(201).send({
          message: "New Role Created"
        })
      })
      .catch((err) => {
        return res.status(400).send({
          message: "Roles require unique titles."
        })
      })
  },
  /**
   * updates a role
   * Route: PUT: /roles/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  update(req, res) {
    Role.findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404)
            .send({
              message: `Role with id: ${req.params.id} not found`
            });
        }
        if (foundRole.dataValues.roleTitle !== 'admin') {
          foundRole.update(req.body)
            .then((updatedRole) => {
              return res.status(201).send(updatedRole);
            });
        } else {
          return res.status(401)
            .send({
              message: 'Admin roleTitle can not be updated'
            });
        }
      });
  },
  /**
   * Delete a role
   * Route: DELETE: /roles/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  delete(req, res) {
    Role.findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404)
            .send({
              message: `Role with id: ${req.params.id} not found`
            });
        }
        if (foundRole.dataValues.roleTitle !== 'admin') {
          foundRole.destroy()
            .then((updatedRole) => {
              return res.status(201).send({
                message: 'The role has been successfully deleted'
              });
            });
        } else {
          return res.status(401)
            .send({
              message: 'Admin can not be deleted'
            });
        }
      });
  },
  /**
   * all
   * @desc gets all the roles
   * Route: GET: /roles
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  all(req, res) {
    Role.findAll()
      .then((roles) => {
        return res.status(200).send({
          message: "Roles Found",
          roles: roles
        })
      });
  }
}
