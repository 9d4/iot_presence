const { Router } = require('express');
const router = Router();

router.get('/api/something/uncool', (req, res) => {
    res.json({
        msg: 'also nothing here',
    });
});

module.exports = router;
