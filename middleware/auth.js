const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.header("x-web-token")
    if (!token) return res.status(401).send("unauthenticated");

    const encoded = jwt.verify(token, process.env.JWT_KEY)
    if (!encoded) return res.status(401).send("unauthenticated");

    req.user = encoded;
    next();
}