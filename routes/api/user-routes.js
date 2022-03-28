const router = require('express').Router();

const { getAllUsers, 
        getUserById, 
        createUser, 
        updateUser,
        deleteUser, 
        addFriend, 
        removeFriend 
} = require('../../controller/user-controller')

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .post(updateUser)
    .delete(deleteUser)

router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend)

module.exports = router