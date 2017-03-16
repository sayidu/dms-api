import {
  Document
} from '../models';

module.exports = {
  docExists(req, res, next) {
    Document.findOne(
      { where : {
        title: req.body.title,
        content: req.body.content
      }} )
      .then((foundDoc) => {
        if (foundDoc) {
          res.status(403).send({
            message: 'This document already exists, change the title or content'
          })
        } else {
          next();
        }
      });
  }
};