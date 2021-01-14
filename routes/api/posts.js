const express = require('express')
const {check, validationResult} = require('express-validator')

const auth = require('../../middlewares/auth')

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

const router = express.Router()

// @route   POST api/posts
// @desc    Create a post
// @access  Private

router.post('/',
    [auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        try {
            const user = await User.findById(req.user.id).select('-password')

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save()

            return res.json(post)

        } catch (e) {
            console.error(e)
            return res.status(500).send(`Server Error`)
        }
    });


// @route   GET api/posts
// @desc    Get all posts
// @access  Public

router.get('/',
    auth,
    async (req, res) => {
        try {
            const posts = await Post.find().sort({date: -1})
            return res.send(posts)

        } catch (e) {
            console.error(e)
            return res.status(500).send(`Server Error`)
        }


    });


// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Private

router.get('/:post_id',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.post_id)

            if (!post) {
                return res.status(404).json({msg: 'Post not found'})
            }

            return res.send(post)

        } catch (e) {
            if (e.kind === 'ObjectId') {
                return res.status(404).json({msg: 'Post not found'})
            }
            console.error(e)
            return res.status(500).send(`Server Error`)
        }


    });


// @route   DELETE api/posts
// @desc    Delete a posts by
// @access  Private

router.delete('/:post_id',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.post_id)

            if (!post) {
                return res.status(404).json({msg: 'Post not found'})
            }

            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({msg: "User not authorized"})
            }

            await post.remove()

            return res.json({msg: 'Post removed'})

        } catch (e) {
            if (e.kind === 'ObjectId') {
                return res.status(404).json({msg: 'Post not found catch'})
            }
            console.error(e)
            return res.status(500).send(`Server Error${e}`)
        }


    });


// @route   PUT api/posts/like/:like_id
// @desc    Like a post
// @access  Private

router.put('/like/:like_id',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.like_id)

            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({msg: 'Post already liked'})
            }

            post.likes.unshift({user: req.user.id})

            await post.save()

            return res.json(post.likes)

        } catch (e) {
            if (e.kind === 'ObjectId') {
                return res.status(404).json({msg: 'Post not found catch'})
            }
            console.error(e)
            return res.status(500).send(`Server Error${e}`)
        }


    });


// @route   PUT api/posts/like/:like_id
// @desc    UnLike a post
// @access  Private

router.put('/unlike/:unlike_id',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.unlike_id)

            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({msg: 'Post has not yet been liked'})
            }

            const unlikeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

            post.likes.splice(unlikeIndex, 1)

            await post.save()

            return res.json({msg: 'Post unliked'})

        } catch (e) {
            if (e.kind === 'ObjectId') {
                return res.status(404).json({msg: 'Post not found catch'})
            }
            console.error(e)
            return res.status(500).send(`Server Error${e}`)
        }


    });


// @route   POST api/posts/comment/:comment_id
// @desc    Comment on a post
// @access  Private

router.post('/comment/:comment_id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            const user = await User.findById(req.user.id).select('-password')

            const post = await Post.findById(req.params.comment_id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)

            await post.save()

            return res.json(post.comments)

        } catch (e) {
            console.error(e)
            return res.status(500).send(`Server Error`)
        }
    });



// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment
// @access  Private

router.delete('/comment/:post_id/:comment_id',
        auth,
    async (req, res) => {
        try {

            const post = await Post.findById(req.params.post_id)

            const comment = post.comments.find( comment => comment.id === req.params.comment_id )

            if (!comment){
                return res.status(400).json({ msg: 'Comment does not exist' })
            }

            if (comment.user.toString() !== req.user.id){
                return res.status(401).json({ msg: 'User not authorized' })
            }

            const uncommentIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

            post.comments.splice(uncommentIndex, 1)

            await post.save()

            return res.json(post.comments)

        } catch (e) {
            console.error(e)
            return res.status(500).send(`Server Error`)
        }
    });



module.exports = router;