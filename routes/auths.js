const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { User, validateAuth } = require("../model/users");

router.post("/", asyncMiddleware(async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);
	
    const user = await User.findOne({ email: req.body.email, isAdmin: req.query.isAdmin ?  req.query.isAdmin : false });
    if (!user) return res.status(400).send("invalid email");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("invalid password");

    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_KEY);
    res.send(token);
}))

module.exports = router;
