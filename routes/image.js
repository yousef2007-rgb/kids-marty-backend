const router = require("express").Router();
const asyncMiddleware = require("../middleware/asyncMiddleware.js");
const fs = require("fs")
const multer = require("multer")

const upload = multer({ dest: "public/" })

router.post("/", asyncMiddleware(async (req, res) => {
    const imageData = req.body.imageData.replace(/^data:image\/.*;base64,/, "");

    const imageUrl = `public/image-${parseInt(Date.now() * Math.random())}.${req.body.extension}`

    fs.writeFile(imageUrl, imageData, "base64", (err) => {
        if (err)
            console.log(err);
        else {
            res.send(imageUrl)
        }
    })

}))

router.post("/images", upload.array('files', 12), asyncMiddleware(async (req, res) => {
    const files = req.files;
    try {
        await Promise.all(
            files.map((file, index) => {
                return new Promise((resolve, reject) => {
                    fs.readFile(file.path, (err, data) => {
                        if (err) {
                            reject(err)
                        }
                        if (data) {
                            fs.writeFile(`public/${file.originalname}`, data, (err) => {
                                if (err) {
                                    reject(err)
                                }
                                fs.unlink(file.path, (err) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    resolve()
                                })
                            })
                        }
                    })
                })
            })
        )
        res.send("successfull")
    } catch (err) {
        throw new Error(err)
    }
}))
module.exports = router;
