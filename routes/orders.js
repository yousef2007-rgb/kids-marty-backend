const router = require("express").Router();
const _ = require("lodash")
const { Order, validateOrder } = require("../model/orders");
const { User } = require("../model/users");
const { Product } = require("../model/products");
const auth = require("../middleware/auth")
const asyncMiddleware = require("../middleware/asyncMiddleware");

router.post("/", auth, asyncMiddleware(async (req, res) => {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newOrder = new Order({
        user: req.user._id,
        products: req.body.products
    })

    await newOrder.save();
    res.send(newOrder)
}))

router.get("/", asyncMiddleware(async (req, res) => {
    const orders = await Order.find().populate("user");
    res.send(orders)
}))


router.get("/:id", asyncMiddleware(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user");
    if(!order) return res.status(404).send("order not found");

    res.send(order)
}))
module.exports = router;
