const router = require('express').Router();
const {
  getAllThoughts,
  getOneThought,
  addThought,
  updateThought,
  deleteThought, // this will delete a thought with using the user id 
  // deleteOneThought, // this will delete a thought with only the tought id
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// api to get all thoughts
router
  .route('/')
  .get(getAllThoughts)
  
  
//  GET / PUT and DELETE methodes to get a single thought, update thought and delete a thought
router
.route('/:id')
.get(getOneThought)
.put(updateThought)
// .delete(deleteOneThought)


router
.route('/:userId/:thoughtId')
.delete(deleteThought)

router
  .route('/:userId')
  .post(addThought)
  
  
router
    .route('/:thoughtId/reactions')
    .post(addReaction)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction)





module.exports = router;