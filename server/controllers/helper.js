import {
  Document,
  User,
  Role
} from '../models';



module.exports = {
  /**
   * isAdmin()
   * @desc Generates approriate query based on user role
   * @param {Object} userRole sequleize Instance object
   * @param {Number} userId userId
   * @returns {Object} query for searching all docs.
   */
   isAdmin (userRole, userId) {
    let query = {};
    if (userRole.dataValues.roleTitle !== 'admin') {
      query = {
        where: {
          ownerId: userId
        }
      };
      return query;
    }
    return query;
  },

  /**
   * sanitizeSearchString()
   * @desc Filters the search string provided by a user
   * @param {String} searchText search string to be filtered
   * @returns {String} query for search .
   */
   sanitizeSearchString (searchText) {
    const sanitizedText = searchText.replace(/[^a-z0-9]/gi, '');
    return sanitizedText;
  }
}