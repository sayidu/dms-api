import {
  Document,
  User,
  Role
} from '../models';
const helper = require('../../server/controllers/helper');


module.exports = {
  /**
   * create
   * @desc Creates a document
   * Route: POST: /documents
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  create(req, res) {
      Document.create(req.body)
       .then(doc => res.status(201).send({
        message: 'Document Created',
        doc,
      }));
  },
  /**
   * getAllDocs
   * @desc gets all documents based on user priviledges
   * relies on isAdmin() method
   * Route: GET: /documents
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  getAllDocs(req, res) {
    Role.find({
      where: req.decoded.RoleId,
    }).then((userRole) => {
      const userId = req.decoded.UserId;
      const query = helper.isAdmin(userRole, userId);
      query.order = [
         ['createdAt', 'DESC'],
      ];

      if (req.query.limit >= 0) query.limit = req.query.limit;
      if (req.query.offset >= 0) query.offset = (req.query.offset - 1) * 10;

      Document.findAll(query)
        .then((docs) => {
          console.log("Admin or not, Query sent", query);
          res.status(200).send({
            docs,
          });
        });
    });
  },
  /**
   * getADoc
   * @desc gets a document based on user priviledges
   * Route: GET: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  getADoc(req, res) {
    Document.findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((doc) => {
        const docData = doc.dataValues;

        if (docData.access === 'public' ||
          (docData.access === 'private' && docData.ownerId === req.decoded.UserId)) {
          return res.status(200).send({
            message: doc,
          });
        }

        if (docData.access === 'private' && docData.ownerId !== req.decoded.UserId) {
          return res.status(403).send({
            message: 'Unauthorised to view this document',
          });
        }
        if (docData.access === 'role') {
          User.find({
              where: {
                id: docData.ownerId,
              },
            })
            .then((foundUser) => {
              if (foundUser.roleId === req.decoded.RoleId) {
                return res.status(200).send({
                  message: 'A document was found',
                  doc,
                });
              }
              return res.status(403)
                .send({
                  message: 'Unauthorised to view this document',
                });
            });
        }
      });
  },
  /**
   * updateADoc
   * @desc updates a document
   * Route: PUT: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  updateADoc(req, res) {
    const updateFields = {};
    Document.findOne({
        where: {
          id: req.params.id,
        },
      })
      .then(() => {
        updateFields.title = req.body.title;
        updateFields.content = req.body.content;
        Document.update(updateFields, {
            where: {
              id: req.params.id,
            },
          })
          .then(updatedDoc => res.status(201).send({
            message: 'Your doc has been updated',
            updatedDoc,
          }));
      });
  },
  /**
   * deleteADoc
   * @desc Delete a document
   * Route: DELETE: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object}
   */
  deleteADoc(req, res) {
    Document.destroy({
        where: {
          id: req.params.id,
        },
      })
      .then((deleteDoc) => {
        if (deleteDoc === 0) {
          return res.status(404).send({
            message: 'This record was not deleted!',
          });
        }
        return res.send({
          message: 'The Document was deleted',
        });
      });
  },
  /**
   * showMyDocs
   * @desc get all documents for a user
   * Route: GET: /users/:id/documents
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  showMyDocs(req, res) {
    User.findOne({
        id: req.params.id,
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt', 'roleId']
      })
      .then((user) => {
        Document.findAll({
            where: {
              ownerId: req.params.id,
            },
          })
          .then(myDocs => res.send({
            docOwner: user,
            myDocs,
          }));
      });
  },
  /**
   * searchDocs
   * @desc search documents based on user priviledges & search preferences
   * Route: GET: /search
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object}
   */
  searchDocs(req, res) {
    const query = {
      where: {
        $and: [{
          $or: [{
            access: 'public',
          }, {
            ownerId: req.decoded.UserId,
          }],
        }],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    };

    if (req.query.limit >= 0) query.limit = req.query.limit;
    if (req.query.offset >= 0) query.offset = (req.query.offset - 1) * 10;
    if (req.query.searchText) {
      const filteredText = helper.sanitizeSearchString(req.query.searchText);
      query.where.$and.push({
        $or: [{
          title: {
            $iLike: `%${filteredText}%`,
          },
        }, {
          content: {
            $iLike: `%${filteredText}%`,
          },
        }],
      });
    }

    Document.findAll(query)
      .then(docs => res.status(200).send({
        docs,
      }));
  },
};

