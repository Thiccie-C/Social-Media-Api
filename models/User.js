const { Schema, model } = require('mongoose')

const UserShema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User email address required'],
        unique: true,
        validate: function (email) {
            return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
        },
        message: validation => `${validation.value} is not a valid email address`
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
)
UserShema.virtual('friendcount').get(function () {
    return this.friends.length;
})

const User = model('User', UserShema)

module.exports = User