const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./categories")
const { brandSchema } = require("./brands")

const varientSchema = new mongoose.Schema({
    title: { type: String, required: true },
    title_ar: { type: String, required: true },
    discription: { type: String, required: true },
    discription_ar: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagesUrls: { type: [String] }
})

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discription: { type: String, required: true },
    lable: {type: String, required: true},
    keywords: { type: String },
    title_ar: { type: String, required: true },
    discription_ar: { type: String, required: true },
    imagesUrls: { type: [String] },
    online_price: { type: Number, required: true },
    wholesale_price: { type: Number, required: true },
    discount: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: mongoose.Schema.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.ObjectId, ref: "Brand", required: true },
    isPublished: { type: Boolean, default: true },
    isInStock: { type: Boolean, default: true },
    dimensions: { type: [String] },
    ageRange: {
        type: String,
        enum: ['0-2', '2-6', '7-12', '13-up']
    },
    varients: { type: [varientSchema] },
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = reqBody => {
    const schema = Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(),
        lable: Joi.alternatives(Joi.string(), Joi.number()).required(),
        keywords: Joi.string(),
        title_ar: Joi.string().required(),
        discription_ar: Joi.string(),
        dimensions:Joi.array().items(Joi.string()),
        imagesUrls: Joi.array().items(Joi.string()),
        online_price: Joi.number().required(),
        wholesale_price: Joi.number().required(),
        discount: Joi.number(),
        imageUrl: Joi.string().required(),
        ageRange: Joi.string(),
        category: Joi.string(),
        brand: Joi.string(),
        isPublished: Joi.boolean(),
        isInStock: Joi.boolean(),
        varients: Joi.array().items(Joi.object({
            title: Joi.string().required(),
            discription: Joi.string().required(),
            title_ar: Joi.string().required(),
            discription_ar: Joi.string(),
            imageUrl: Joi.string().required(),
            imagesUrls: Joi.array().items(Joi.string()),
            _id:Joi.string(),
        })),
    })

    return schema.validate(reqBody)
}

module.exports = {
    Product,
    productSchema,
    validateProduct
}
