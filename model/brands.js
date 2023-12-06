const mongoose = require("mongoose");
const Joi = require("joi");


const brandSchema = new mongoose.Schema({
    title: { type: String, requried: true },
    discription: { type: String, required: true },
    title_ar: { type: String, requried: true },
    discription_ar: { type: String, },
    keywords: { type: String },
    imageUrl: { type: String, required: true },
    lable: { type: String, required: true }
});

const Brand = mongoose.model("Brand", brandSchema);

const validateBrand = reqBody => {
    const schema = Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(),
        title_ar: Joi.string().required(),
        discription_ar: Joi.string(),
        keywords: Joi.string(),
        imageUrl: Joi.string().required(),
        lable: Joi.string().required()
    })

    return schema.validate(reqBody)
}

module.exports = {
    Brand,
    brandSchema,
    validateBrand
}
