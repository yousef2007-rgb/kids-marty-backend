const router = require("express").Router();
const { Brand, brandSchema, validateBrand } = require("../model/brands");
const asyncMiddleware = require("../middleware/asyncMiddleware")
const _ = require("lodash")
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

router.post("/", auth, admin, asyncMiddleware(async (req, res) => {
    const { error } = validateBrand(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const newBrand = new Brand(req.body);
    await newBrand.save()

    res.send(newBrand);
}));

router.get("/", asyncMiddleware(async (req, res) => {
    const brands = await Brand.find();
    res.send(brands)
}))

router.get("/:id", asyncMiddleware(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send("no such brand found");
    res.send(brand)
}))

router.put("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send("no such brand found");

    const { error } = validateBrand(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    brand.set(_.pick(req.body, [
        "title",
        "discription",
        "keywords",
        "title_ar",
        "discription_ar",
        "keywords_ar",
        "online_price",
        "wholesale_price",
        "discount",
        "imageUrl",
        "ageRange",
        "varients"
    ]));
    await brand.save()

    res.send(brand);
}))

router.delete("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const brand = await Brand.findByIdAndRemove(req.params.id);
    if (!brand) return res.status(404).send("no such brand found");
    res.send(brand)
}))

module.exports = router;
