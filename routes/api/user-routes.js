const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} = require('../../controllers/user-controller');

// Set up GET all and POST at /api/
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser)

router
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend)

module.exports = router;