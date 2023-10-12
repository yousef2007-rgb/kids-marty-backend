const mongoose = require("mongoose");
const Joi = require("joi")
const { userSchema } = require("./users");
const { productSchema } = require("./products");

const item = new mongoose.Schema({
    product_id: { type: String, required: true },
    imageUrl: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, min: 1, required: true }
})

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,ref: "User", required: true },
    products: { type: [item], required: true },
});

const Order = mongoose.model("Order", orderSchema);

const validateOrder = reqBody => {
    const schema = Joi.object({
        products: Joi.array().items(Joi.object({
            product_id: Joi.string().required(),
            imageUrl: Joi.string(),
            title: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required()
        }))
    });

    return schema.validate(reqBody);
}

module.exports = {
    orderSchema,
    Order,
    validateOrder
}
