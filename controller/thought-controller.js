const { Thought, User } = require('../models')
const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    getThoughtsById({ params }, res) {
        Thought.findOne({ _id: params.id})
        .select('-__v')
        .sort({ _id: -1})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with that id'})
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },
    
    addThought({ body }, res) {
        Thought.create(body)
        .then((ThoughtData) => {
            return User.findOneAndUpdate(
                { _id: body.user_id},
                { $addToSet: {thoughts: ThoughtData._id}},
                { new: true}
                );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with that id'})
                return
            }
            res.json(dbUserData)
        })
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $set: body},
            {runValidators: true, new: true}
            ).then(updatedThought => {
                if(!updatedThought) {
                    return res.status(404).json({ message: 'No thought with this id!'})
                }
                return res.json({ message: 'Success'})
            })
            .catch(err => res.json(err))
    },

    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if(!deletedThought) {
                    return res.status(404).json({ message:'No thought with this id!'});
                }
                return User.findOneAndUpdate(
                    {thoughts: params.thoughtId},
                    { $pull: { thoughts: params.thoughtId}},
                    {new: true});
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).jso({ message: 'No thought found with this id!'});
                    return
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
    },
    
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: {reactions: body}},
            {new: true, runValidators: true})
            .then(updatedThought => {
                if(!updatedThought) {
                    res.status(404).json({ message: 'No reacction found with this id!' })
                    return
                }
                res.json(updatedThought)
            })
            .catch(err => res.json(err))
    },
    removeReaction({ params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: {reactions: {reactionId: params.reactionId}}},
            {new: true})
            .then((updatedThought) => {
                if(!updatedThought) {
                    res.status(404),json({ message: 'No reaction found with this id'});
                    return
                }
                res.json(updatedThought)
            })
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;