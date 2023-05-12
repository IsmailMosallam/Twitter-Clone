const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const Schema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('This Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [7, 'This password must contain >= 7'],
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('This password is contain password ')
            }

        }
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.jpg"


    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'

    }],
    retweets: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'


    }]
}, { timestamps: true });
Schema.statics.Credentials = async(email, userName, password) => {
    const user = await users.findOne({
        $or: [{ email }, {
            userName
        }]
    })
    if (!user) {
        throw new Error('Unable to login')
    }


    await bcrypt.compare(password, user.password, function(err, isMatch) {
        if (!isMatch) {
            console.log(user.password)
            throw new Error('Unable to login')
        }
    })


    return user;

}

Schema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        const hash_password = await bcrypt.hash(user.password, 8)
        user.password = hash_password;
    }
    next();
});
const users = mongoose.model('Users', Schema)
module.exports = users