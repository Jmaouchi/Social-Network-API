// require the user model or table (mysql)
const path = require('path');
const { User, Thought } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({}) // empty object will find evrything 
    // this is to populate all the data from the thoughts model ( its the same than include in mysql). if we did not include that, we will only =>
    // =>  get the _id back.
    .populate({
      path: 'thoughts',
      select: '-__v'
      })
    // this wiill take off the _v that is coming from the data (this is a mongoose field by default)
    .select('-__v')
    // this method will sort the data from newest to oldest
    .sort({ _id: -1 })
    //then display the data
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  
  
  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
      path: 'thoughts',
      select: '-__v'
      })
      .populate({
        path:'friends',
        select: '-__v',
      })
      .select('-__v')
      .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },



  // create a user 
  createUser({ body }, res) { // we only need the body instead of the whole req.
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(500).json(err));
  },



  // update a user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true , runValidators: true})// this {new: true } will return the original document. 
    //By setting the parameter to true, we're instructing Mongoose to return the new version of the document to include the update.
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
         res.json({message: `user with a username of ${dbUserData.username}, and an email of ${dbUserData.email} is been updated`});
      })
      .catch(err => res.status(500).json(err));
  },



  // delete a  user
  deleteUser({ params }, res) {
  User.findOneAndDelete({ _id: params.id })
  .then(dbUserData => {
  if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this ID!' });
      return;
  }
  res.json(dbUserData);
  })
  .catch(err => res.status(400).json(err))
  },



  // Post a friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
        {_id: params.userId},
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true}
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },



  //remove Friend
  removeFriend( { params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId }},
        { new: true}
    )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
  }
}


module.exports = userController;