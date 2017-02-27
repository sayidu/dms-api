const Document = require('../models').Document;
const User = require('../models').User;

module.exports = {
  create(req, res) {
    const data = req.body;
    if (data.title && data.content && data.ownerId) {
      Document.create(req.body)
        .then((doc) => {
          return res.status(201).send({
            message: 'Document Created',
            doc: doc
          });
        })
        .catch((err) => {
          return res.status(400).send(err.errors);
        });
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Please complete all required fields',
      });
    }
  },
  getAllDocs(req, res) {
    const query = {
      where: {
        $or: [{access: 'public'},
        {ownerId: req.decoded.UserId}]
      }
    };
    query.order = [['createdAt', 'DESC']];

    if (req.query.limit) query.limit = req.query.limit;
    if (req.query.offset) query.offset = (req.query.offset - 1) * 10;

    Document.findAll(query)
      .then((docs) => {
        res.status(201).send({
          docs
        });
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  getADoc(req, res) {
    Document.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((doc) => {
      const docData = doc.dataValues;
      if (docData.access === 'public'||(docData.access === 'private' && docData.ownerId === req.decoded.UserId)) {
        res.status(201).send({
            message: doc
        });
      }

        if (docData.access === 'private' && docData.ownerId !== req.decoded.UserId) {
          res.status(401).send({
            message: 'Unauthorised to view this document'
          });
        }
        if (docData.access === 'role') {
          User.find({
              where: {
                id: docData.ownerId
              }
            })
            .then((foundUser) => {
              if (foundUser.roleId === req.decoded.roleId) {
                res.status(201).send({
                  message: doc
                })
              } else {
                res.status(403)
                  .send({
                    message: 'Unauthorised to view this document'
                  });
              }
            });
        }
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  updateADoc(req, res) {
    const updateFields = {};
    Document.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((selectDoc) => {
         if (req.query.title) query.title = req.query.title;
         if (req.query.content) query.content = req.query.content;
        Document.update(updateFields, {
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
            message: 'This record was not deleted!',
          });
        }
        res.status(201).send({
          message: 'The Document was deleted',
        });
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
            message: 'You are yet to create a document',
          });
        }
        res.status(201).send({
          message: myDocs,
        });
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  },
  searchDoc(req, res) {
    const query = {
      where: {
        $or: [{
          access: 'public'
        }, {
          ownerId: req.decoded.UserId
        }]
      }
    };
    query.order = [
      ['createdAt', 'DESC']
    ];

    if (req.query.limit) query.limit = req.query.limit;
    if (req.query.offset) query.offset = (req.query.offset - 1) * 10;
  }
};
