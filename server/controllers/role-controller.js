import {
  Role
} from '../models';

module.exports = {
  /**
   * create
   * @desc Creates a role
   * Route: POST: /roles
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  create(req, res) {
    Role.create(req.body)
      .then(role => res.status(201).send({
        message: 'New Role Created',
        role,
      }))
      .catch(err => res.status(400).send({
        message: 'Roles require unique titles.',
        err: err.errors,
      }));
  },
  /**
   * update
   * @desc updates a role
   * Route: PUT: /roles/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  update(req, res) {
    Role.findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404)
            .send({
              message: `Role with id: ${req.params.id} not found`,
            });
        }
        if (foundRole.dataValues.roleTitle !== 'admin') {
          foundRole.update(req.body)
            .then(updatedRole => res.status(201).send({
              message: 'Sucessfully Updated',
              updatedRole
            }, ));
        } else {
          return res.status(403)
            .send({
              message: 'Admin roleTitle can not be updated',
            });
        }
      });
  },
  /**
   * delete
   * @desc Delete a role
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
              message: `Role with id: ${req.params.id} not found`,
            });
        }
        if (foundRole.dataValues.roleTitle !== 'admin') {
          foundRole.destroy()
            .then(res.status(200).send({
              message: 'Successfully Deleted',
            }));
        } else {
          return res.status(403)
            .send({
              message: 'Admin can not be deleted',
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
      .then(roles => res.status(200).send({
        message: 'Roles Found',
        roles,
      }));
  },
};
