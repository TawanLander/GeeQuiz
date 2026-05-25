const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/mudarValores', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/sources/html/mudarValores.html'));
});

router.get('/reverterValores', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/sources/html/reverterValores.html'));
});

module.exports = router;
