const { Router } = require('express');
const router = Router();

router.get('/api/something', (req, res) => {
    res.json({
        msg: 'nothing here',
    });
});
router.get('/api/something/cool', (req, res) => {
    res.json({
        msg: 'also nothing here',
    });
});

module.exports = router;
