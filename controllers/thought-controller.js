// require the user model or table (mysql)
const { User, Thought } = require('../models');

const userController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
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


  // Finde a single a thought
  getOneThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .then(dbThoughData => {
        // If no though is found, send 404
        if (!dbThoughData) {
          res.status(404).json({ message: 'No though found with this id!' });
          return;
        }
        res.json(dbThoughData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });  
  },


  // Add a thought and update the user data to include that thought
  addThought({ params, body }, res) {
    console.log('params is', params);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbThoughData => {
        console.log(dbThoughData);
        if (!dbThoughData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbThoughData);
      })
      .catch(err => res.json(err));
  },



  // update a thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true , runValidators: true})// this {new: true } will return the original document. 
    //By setting the parameter to true, we're instructing Mongoose to return the new version of the document to include the update.
      .then(dbThoughData => {
        if (!dbThoughData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
         res.json({message: `${dbThoughData.username} thought,  is been updated`});
      })
      .catch(err => res.status(500).json(err));
  },


  // delete a single user
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No Thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(`user ${dbUserData.username} thought is been deleted`);
      })
      .catch(err => res.json(err));
  },
}


module.exports = userController;