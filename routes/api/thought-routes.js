const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require('../../controller/thought-controller')

router
    .route('/')
    .get(getAllThoughts)
    .post(addThought)

router
    .route('/:thoughtId')
    .get(getThoughtsById)
    .put(updateThought)
    .delete(removeThought)

router
    .route('/:thoughtId/reactions')
    .post(addReaction)

router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

  module.exports = router