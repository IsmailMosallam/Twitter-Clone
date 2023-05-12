const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    content: { type: String, trim: true },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Users'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'

    }],
    retweetUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'

    }],
    retweetData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }]
}, {
    timestamps: true
})


const Posts = mongoose.model('Posts', Schema);
module.exports = Posts