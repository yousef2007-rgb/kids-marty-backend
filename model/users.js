const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 2, max: 20 },
    email: { type: String, required: true, min: 2 },
    password: { type: String, required: true, min: 2 },
    phone: { type: String, min: 9, max: 9 },
    city: {
        type: String, enum: [
            "Amman",
            "Zarqa",
            "Irbid",
            "Jerash",
            "Aqaba",
            "Ajloun",
            "Alsalt",
            "Almafraq",
            "Altafila",
            "Alkarek",
            "Maan",
            "Madaba",
            "Alagwar"
        ], required: true
    },
    location: { type: String, required: true },
    age: { type: Number, min: 0, max: 100 },
    isAdmin: { type: Boolean, default: false },
});

const codeSchema = new mongoose.Schema({
    code: { type: Number }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_KEY);
}

const User = mongoose.model("User", userSchema);
const Code = mongoose.model("Code", codeSchema);

const validateUser = (reqBody) => {
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(20),
        email: Joi.string().required().min(2).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')).required(),
        repeat_password: Joi.ref('password'),
        phone: Joi.string().length(9).pattern(/^[0-9]+$/).required(),
        city: Joi.string().required(),
        location: Joi.string().required(),
        age: Joi.number().required(),
        code: Joi.number(),
        id: Joi.string(),
    });

    return schema.validate(reqBody);
}

const validateAuth = (reqBody) => {
    const schema = Joi.object({
        email: Joi.string().required().min(2).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().required().min(2),
    });

    return schema.validate(reqBody);
}

module.exports = {
    userSchema,
    User,
    validateUser,
    validateAuth,
    Code
}
