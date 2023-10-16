const router = require("express").Router();
const { Category, validateCategory } = require("../model/categories");
const asyncMiddleware = require("../middleware/asyncMiddleware")
const _ = require("lodash")
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

router.post("/", auth, admin, asyncMiddleware(async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const newCategory = new Category(req.body);
    await newCategory.save()

    res.send(newCategory);
}));

router.get("/", asyncMiddleware(async (req, res) => {
    const categories = await Category.find();
    res.send(categories)
}))

router.get("/:id", asyncMiddleware(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send("no such category found");
    res.send(category)
}))

router.put("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send("no such category found");

    const { error } = validateCategory(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    category.set(req.body);
    await category.save()

    res.send(category);
}))

router.delete("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send("no such category found");

    res.send(category)
}))

module.exports = router;
