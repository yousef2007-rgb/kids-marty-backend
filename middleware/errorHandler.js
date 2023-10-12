module.exports = (err, req, res, next) => {
    res.status(500).send(`something went wrong: ${err}`)
    console.error(err);
}