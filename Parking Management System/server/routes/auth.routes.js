const controller = require('../controllers/auth.controller.js');
const checkDuplicateEmail = require('../middleware/verifySignUp.js');
const checkIsAdmin = require('../middleware/verifyAdmin.js');
// const verifyToken = require("../middleware/verifyToken.js")

module.exports = function(app) {
  app.post('/signup', [checkDuplicateEmail], controller.signup);

  app.post('/signin', [checkIsAdmin], controller.signin);

  app.get('/signout', controller.signout);

  app.post('/check-password', controller.matchPassword);

  app.post('/update-password', controller.updatePassword);
};
