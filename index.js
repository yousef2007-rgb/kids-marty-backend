const express = require("express");
const app = express();
const Joi = require('@hapi/joi')
const fileUpload = require('express-fileupload');
Joi.objectId = require('joi-objectid')(Joi)
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/kids-marty')
    .then(() => console.log('Connected!'));

const products = require("./routes/products")
const categories = require("./routes/categories")
const brands = require("./routes/brands")
const orders = require("./routes/orders")
const errorHandler = require("./middleware/errorHandler")
const users = require("./routes/users");
const auths = require("./routes/auths");
const image = require("./routes/image");
const cors = require('cors');

app// Increase payload limit for JSON requests to 10MB
app.use(express.json({ limit: '10mb' }));

// Increase payload limit for URL-encoded requests to 10MB
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());
app.use(cors());
app.use("/public", express.static("./public"));
app.use("/api/products", products)
app.use("/api/categories", categories)
app.use("/api/brands", brands)
app.use("/api/orders", orders)
app.use("/api/users", users)
app.use("/api/auth", auths)
app.use("/api/image", image)


app.use(errorHandler)

app.get("/health", (req, res) => {
    res.send("every thing is working")
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))
