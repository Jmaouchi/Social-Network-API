const router = require('express').Router();
const {
  getAllThoughts,
  getOneThought,
  addThought,
  updateThought,
  deleteThought
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

  
// POST api tp create a thought
router
  .route('/:userId')
  .post(addThought)
 

router
.route('/:userId/:thoughtId')
.delete(deleteThought)


module.exports = router;