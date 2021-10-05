const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET a user: api/users
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username });
        const { password, updatedAt, ...other } = user._doc; // giúp cho mình không hiện password, và updateAt, chỉ hiện other
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friendAll = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friendAll.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE a user: api/users/:id
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // mã hóa trước khi gửi xuống để set
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).json({ msg: error.message });
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json({ msg: "Account has been updated" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        return res
            .status(403)
            .json({ msg: "You can update only your account" });
    }
});

// DELETE a user: api/users/:id
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ msg: "Account has been deleted" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        return res
            .status(403)
            .json({ msg: "You can deleted only your account" });
    }
});

// FOLLOW a user: api/users/:id/follow
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });

                res.status(200).json({ msg: "user has been followed" });
            } else {
                res.status(400).json({ msg: "You already follow this user" });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        res.status(400).json({ msg: "You cant follow yourself" });
    }
});

// UNFOLLOW a user: api/users
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });

                res.status(200).json({ msg: "user has been followed" });
            } else {
                res.status(400).json({ msg: "You already unfollow this user" });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        res.status(400).json({ msg: "You cant unfollow yourself" });
    }
});

module.exports = router;
