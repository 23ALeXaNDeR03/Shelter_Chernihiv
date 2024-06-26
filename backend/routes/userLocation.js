const express = require('express');
const router = express.Router();

let userLocation = null;

// Обробка POST-запиту для зберігання розташування користувача
router.post('/', (req, res) => {
    try {
        userLocation = req.body;
        console.log('User location updated:', userLocation);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
