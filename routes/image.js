const router = require("express").Router();
const asyncMiddleware = require("../middleware/asyncMiddleware.js");
const fs = require("fs")

router.post("/", asyncMiddleware(async (req, res) => {
    const imageData = req.body.imageData.replace(/^data:image\/.*;base64,/, "");
    
    console.log(imageData)
    const imageUrl = `public/image-${parseInt(Date.now() * Math.random()) }.${req.body.extension}`

    fs.writeFile(imageUrl, imageData, "base64", (err) => {
        if (err)
            console.log(err);
        else {
            res.send(imageUrl)
        }
    })

}))
module.exports = router;
