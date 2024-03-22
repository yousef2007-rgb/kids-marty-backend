const router = require("express").Router();
const asyncMiddleware = require("../middleware/asyncMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middleware/auth");
const speakeasy = require('speakeasy');
const { User, validateUser } = require("../model/users")


router.get("/me", auth, asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(_.pick(user, ["username", "email", "city", "location", "age", "phone"]));
}))

router.post("/", asyncMiddleware(async (req, res) => {
    const secret = speakeasy.generateSecret({ length: 20 });

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        ..._.pick(req.body, ["username", "email", "city", "location", "age", "phone"]),
        password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_KEY);;
    res.send(token)
}))

module.exports = router;
