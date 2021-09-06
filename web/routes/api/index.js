const { Router } = require('express');
const router = Router();

router.route('/')
    .get((req, res) => {
        res.status(403);
        res.send();
    });

module.exports = [
    router,
    require('./presence'),
];
