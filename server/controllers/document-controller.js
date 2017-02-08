const Document = require('../models').Document;

module.exports = {
  create(req, res) {
    Document.create(req.body)
      .then((doc) => {
        res.status(201).send({
          message: "Document Created"
        });
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  getDocs(req, res) {
    Document.findAll({})
      .then((docs) => {
        res.status(201).send({
          message: docs
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      })
  },
  getADoc(req, res) {
    Document.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((doc) => {
        res.status(201).send({
          message: doc
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      })
  },
  updateADoc(req, res) {
    Document.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((selectDoc) => {
        Document.update({
            title: req.body.title,
            content: req.body.content
          }, {
            where: {
              id: req.params.id
            }
          })
          .then((updateDoc) => {
            res.status(201).send({
              message: 'Your doc has been updated'
            });
          })
          .catch((err) => {
            res.status(400).send(err.errors);
          });
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  deleteADoc(req, res) {
    Document.destroy({
        where: {
          id: req.params.id
        }
      })
      .then((deleteDoc) => {
        if (deleteDoc === 0) {
          return res.status(409).send({
            message: "This record was not deleted!",
          });
        }
        res.status(201).send({
          message: "The Document was deleted",
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  showMyDocs(req, res) {
    Document.findAll({
        where: {
          ownerId: req.params.id
        }
      })
      .then((myDocs) => {
        if (myDocs.length === 0) {
          return res.status(409).send({
            message: "You are yet to create a document",
          });
        }
        res.status(201).send({
          message: myDocs,
        })
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  }
};