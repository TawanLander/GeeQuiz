const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/mudarValores', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/sources/js/mudarValores.html'));
});

router.get('/reverterValores', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/sources/js/reverterValores.html'));
});

module.exports = router;
