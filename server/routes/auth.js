const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register: api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await new User({
            username,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Login: api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        !user && res.status(403).json({ msg: "user not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        !validPassword && res.status(400).json({ msg: "wrong password" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
