const express = require('express');
const router = express.Router();

router.get('/mudarValores', (req, res) => {
    res.sendFile(__dirname + '../../public/sources/js/mudarValores.html');
});

module.exports = router;
