const express = require("express");
const posts = require('../../Schema/Post');
const users = require("../../Schema/user");
const Users = require('../../Schema/user')
const router = express.Router();

router.get('/', async(req, res) => {
    const data = await posts.find().sort({ "createdAt": -1 })
        .populate('postBy')


    res.status(200).send(data)
})

router.post('/', async(req, res) => {
    var data = {
        content: req.body.content,
        postBy: req.session.user
    }
    const newPost = await posts.create(data)
    const post = await Users.populate(newPost, { path: 'postBy' })
    res.status(201).send(post);
});

router.put('/:id/like', async(req, res) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.user = await Users.findByIdAndUpdate(userId, {
            [option]: { likes: postId }
        }, { new: true })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    // Insert post like
    var post = await posts.findByIdAndUpdate(postId, {
            [option]: { likes: userId }
        }, { new: true })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })


    res.status(200).send(post)

});
router.post('/:id/retweet', async(req, res) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    // Try and delete retweet
    var deletedPost = await posts.findOneAndDelete({ postBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    var option = deletedPost != null ? "$pull" : "$addToSet";

    var repost = deletedPost;

    if (repost == null) {
        repost = await posts.create({ postBy: userId, retweetData: postId })
            .catch(error => {
                console.log(error);
                res.sendStatus(400);
            })
    }

    // Insert user like
    req.session.user = await users.findByIdAndUpdate(userId, {
            [option]: { retweets: repost._id }
        }, { new: true })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    // Insert post like
    var post = await posts.findByIdAndUpdate(postId, {
            [option]: { retweetUser: userId }
        }, { new: true })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })


    res.status(200).send(post)

});



module.exports = router