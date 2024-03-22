const router = require("express").Router();
const asyncMiddleware = require("../middleware/asyncMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middleware/auth");
const speakeasy = require('speakeasy');
const mail = require("../email/index");
const { User, validateUser, Code } = require("../model/users")


router.get("/me", auth, asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(_.pick(user, ["username", "email", "city", "location", "age", "phone"]));
}))

router.post("/generateCode", asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists");

    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const newCode = new Code({ code: code });
    await newCode.save();

    await mail.send(`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Two-Factor Authentication</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;padding:20px;margin:0;}.container{max-width:600px;margin:auto;background-color:#ffffff;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);}h1{color:#333333;}p{color:#666666;}.code{background-color:#f0f0f0;padding:10px;border-radius:5px;font-size:24px;margin-bottom:20px;}.footer{text-align:center;margin-top:20px;color:#999999;}</style></head><body><div class="container"><h1>Two-Factor Authentication</h1><p>Dear User,</p><p>Your authentication code is:</p><div class="code">${code}</div><p>Please enter this code in the appropriate field to complete the authentication process.</p><p>If you did not request this code, please ignore this email.</p><p>Thank you,</p><p>KidzMarty</p><div class="footer">This is an automated email, please do not reply.</div></div></body></html>`, req.body.email, "code")

    res.send(newCode._id);
}))

router.post("/", asyncMiddleware(async (req, res) => {
    console.log(req.body);
    const code = await Code.findOne({ _id: req.body.id });
    console.log(code);

    if (code.code != req.body.code || !code) return res.status(400).send("wrong code")

    await Code.findByIdAndDelete(req.body.id)


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
