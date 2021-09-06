const router = require('express').Router();

// log incoming request to console
router.use((req, res, next) => {
    console.log(
        req.method,
        " ",
        req.url,
    );

    next();
});

module.exports = router;
