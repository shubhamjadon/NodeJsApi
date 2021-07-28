const router = require('express').Router();
const { getUsers, updateUser } = require('../controllers/user.controller');

router.route('/').get(getUsers).put(updateUser);

module.exports = router;
