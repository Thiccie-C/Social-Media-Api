const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1})
        ,then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err))
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id.'});
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id'})
                    return
                }
                return dbUserData
            })
            .then(dbUserData => {
                User.updateMany({
                    _id: {
                        $in: dbUserData.friends
                    }
                }, {
                    $pull: {
                        friends: params.userId
                    }
                })
                .then(() => {
                    Thought.deleteMany({username: dbUserData.username})
                })
                .then(() =>{
                    res.json({ message: 'Usrr deleted successfully'})
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId}, 
            {$push: { friends: params.friendId}},
            {new: true})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!'})
                }
            })
    },
    removeFriend({ params }, res) {
        User.findOneAndDelete({ _id: params.thoughtId})
        .then(deletedFriend => {
            if(!deletedFriend) {
                return res.status(404).json({ message: 'No friend found with this id'})
            }
            return User.findOneAndUpdate(
                {friends: params.friendId},
                { $pull: { frieneds: params.friendId}},
                {new: true}
                );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No friend with this id'})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err))
    }
}

module.exports = userController;