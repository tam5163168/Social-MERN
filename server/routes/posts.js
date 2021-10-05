const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// get a post: api/posts/:id
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// get user all post: api/posts/profile/:username
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// get all post: api/posts/timeline
router.get("/timeline/:userId", async (req, res) => {
    try {
        // lấy user từ id
        // lấy user lấy được bài đăng
        // lấy id mình đã theo dỗi rồi tìm bằi đăng của id đó, lấy được bài đăng của người mình theo dõi
        // rồi bài đăng của mình sẽ được keestn ối với bài đăng của bạn bè để show ra hết tắt cả các bài đăng của mình và bạn bè

        const currentUser = await User.findById(req.params.userId);
        console.log(currentUser);

        const userPosts = await Post.find({ userId: currentUser._id });
        console.log(123);
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );

        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// create a post: api/posts/:id
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// update a post: api/posts/:id
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({ msg: "The post has been updated" });
        } else {
            res.status(400).json({ msg: "you can update only your post " });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// delete a post: api/posts/:id
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json({ msg: "The post has been deleted" });
        } else {
            res.status(400).json({ msg: "you can update only your post " });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// like a post: api/posts/:id
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json({ msg: "The post has been liked" });
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json({ msg: "The post has been disliked" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
