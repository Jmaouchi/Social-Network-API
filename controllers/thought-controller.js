// require the user model or table (mysql)
const { User, Thought } = require('../models');

const userController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({path: 'reactions', select: '-__v'})
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
      .populate({path: 'reactions', select: '-__v'})
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
    console.log(params);
    Thought.create(body)
      .then(({ _id }) => { // get the id from the thought data then use it to that to the user data 
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbThoughData => {
        console.log(dbThoughData);
        if (!dbThoughData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbThoughData);
      })
      .catch(err => res.json(err));
  },


  //add reaction
  addReaction ({ params, body}, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought with this ID!' });
            return;
        }
        res.json(dbThoughtData)
    })
    .catch(err => res.json(err));
  },



  //delete Reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
  },


  
  // update a thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true , runValidators: true})// this {new: true } will return the original document. 
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


  // delete a single thought
  // deleteOneThought({ params }, res) {
  //   Thought.findOneAndDelete({ _id: params.id })
  //   .then(dbUserData => {
  //   if (!dbUserData) {
  //       res.status(404).json({ message: 'No Thought found with this ID!' });
  //       return;
  //   }
  //   res.json(`user ${dbUserData.username} thought is been deleted`);
  //   })
  //   .catch(err => res.status(400).json(err))
  // },


   // delete a thought and update user data 
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