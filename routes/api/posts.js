const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   POST api/posts
// @desc    create a post
// @access  private
router.post("/", [
    auth,
    [
        check("text", "Text is required").not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);

    } catch (error) {
        console.log(error.message);
        res.status(500).json('Server Error');
    }

});


// @route   GET api/posts
// @desc    get all posts
// @access  private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error.kind);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ msg: 'Post not found' });
        }
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({ msg: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).send({ msg: 'User not authorized' });
        }

        // delete user
        await post.remove();
        res.json({ msg: "Post removed" });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ msg: 'Post not found' });
        }
        res.status(500).send("Server error");
    }
});

// @route   PUT api/posts/like/:id
// @desc    like post
// @access  private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const likes = post.likes.filter(like => {
            return like.user.toString() === req.user.id
        });

        if (likes.length > 0) {
            return res.status(400).send({ msg: 'Post Already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ msg: 'Post not found' });
        }
        res.status(500).send("Server error");
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    unlike post
// @access  private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const likes = post.likes.filter(like => {
            return like.user.toString() === req.user.id
        });

        if (likes.length === 0) {
            return res.status(400).send({ msg: 'Post has not yet been liked' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ msg: 'Post not found' });
        }
        res.status(500).send("Server error");
    }
});

// @route   POST api/posts/comment/:id
// @desc    comment on post
// @access  private
router.post("/comment/:id", [
    auth,
    [
        check("text", "Text is required").not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.log(error.message);
        res.status(500).json('Server Error');
    }

});

// @route   POST api/posts/comment/:id/:comment_id/
// @desc    delete comment
// @access  private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find((comment) => {
            return comment.id === req.params.comment_id;
        });

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ msg: 'Post not found' });
        }
        res.status(500).send("Server error");
    }
});

module.exports = router;
