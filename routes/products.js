const router = require("express").Router();
const { Product, productSchema, validateProduct } = require("../model/products");
const { Category } = require("../model/categories")
const { Brand } = require("../model/brands")
const asyncMiddleware = require("../middleware/asyncMiddleware")
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const XLSX = require("xlsx");
const multer = require("multer")
const object = require("@hapi/joi/lib/types/object");

router.post("/", auth, admin, asyncMiddleware(async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const newProduct = new Product(req.body);
    await newProduct.save()

    res.send(newProduct);
}));

router.get("/", asyncMiddleware(async (req, res) => {
    const products = await Product
        .find()
        .populate(['category', 'brand'])
        .skip(req.query.skip || req.query.skip != 0 ? req.query.skip - 1 * req.query.limit : 0)
        .limit(req.query.limit ? req.query.limit : null);
    res.send(products)
}))

router.get("/:id", asyncMiddleware(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(['category', 'brand'])
        ;
    if (!product) return res.status(404).send("no such product found");
    res.send(product)
}))

router.put("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("no such product found");

    const { error } = validateProduct(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    product.set(req.body);
    await product.save()

    res.send(product);
}))

router.delete("/:id", auth, admin, asyncMiddleware(async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send("no such product found");
    res.send(product)
}))

const upload = multer({ dest: "public/" });

router.post("/excel/upload", upload.single('file'), asyncMiddleware(async (req, res) => {
    const reqData = req.file;
    const file = XLSX.readFile(reqData.path);
    const data = file.Sheets.Sheet1;
    const newProducts = [];
    let column = 1;
    while (data[`A${column}`]) {
        let newProduct = null;
        const product = {
            title: data["A" + column].v,
            discription: data["B" + column].v,
            lable: data["C" + column].v,
            keywords: data["D" + column].v,
            title_ar: data["E" + column].v,
            discription_ar: data["F" + column].v,
            imagesUrls: data["G" + column].v.split(","),
            online_price: data["H" + column].v,
            wholesale_price: data["I" + column].v,
            discount: data["J" + column].v,
            imageUrl: data["K" + column].v,
            category: data["L" + column].v,
            brand: data["M" + column].v,
            isPublished: data["N" + column].v == 0 ? false : true,
            dimensions: data["O" + column].v.split(","),
            ageRange: data["P" + column].v
        }


        const { error } = validateProduct(product);

        if (error) return res.status(401).send(`at column ${column}: ${error.details[0].message}`)
        const searchExistingProduct = await Product.findOne({ lable: product.lable })
        if (searchExistingProduct) {
            newProduct = searchExistingProduct.set(product);
        } else {
            newProduct = new Product(product)
        }
        await newProduct.save();
        newProducts.push(newProduct);
        column++;
    }
    res.send(newProducts);
}))


module.exports = router;
