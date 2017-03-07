import jwt from 'jsonwebtoken';

import {
  User,
  Role
} from '../models';

const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';


module.exports = {
  isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization || req.headers['x-access-token'];
    if (!authToken) {
      return res.status(401).json({
        done: false,
        message: 'Please Login!',
      });
    } else if (authToken) {
      jwt.verify(authToken, secret, (err, decoded) => {
        if (err) {
          return res.status(401)
            .json({
              done: false,
              message: 'Invalid Authentication Details',
            });
        }
        User.findById(decoded.UserId).then((user) => {
          const blacklistToken = user.dataValues.userState;
          req.decoded = decoded;
          if (blacklistToken === true) {
            return next();
          } else {
            return res.status(401).json({
              done: false,
              message: 'Please Login!',
            });
          }
        });
      });
    }
  },
  isAdmin(req, res, next) {
    User.findById(req.decoded.UserId)
      .then((user) => {
        Role.findById(user.roleId)
          .then((role) => {
            if (role.dataValues.roleTitle !== 'admin') {
              return res.status(401).send({
                message: 'Unauthorised User',
              });
            } else {
              return next();
            }
          });
      });
  },
};