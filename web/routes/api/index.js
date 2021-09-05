const { Router } = require('express');
const router = Router();

router.get('/api', (req, res) => {
    res.json('this is prefix for all api endpoints');
});


module.exports = [
    router,
    require('./something'),
    require('./presence'),
];