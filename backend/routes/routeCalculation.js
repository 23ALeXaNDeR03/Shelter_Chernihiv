const express = require('express');
const router = express.Router();
const { userLocation } = require('./userLocation');

router.post('/calculate-route', (req, res) => {
    const { destinationLat, destinationLng, transportMode } = req.body;

    if (!userLocation) {
        return res.status(400).json({ error: 'User location not set' });
    }

    // Тут логіка розрахунку маршруту
    // Використовуй userLocation.latitude, userLocation.longitude як початкову точку
    // і destinationLat, destinationLng як кінцеву точку
    // Врахуйт transportMode при розрахунку

    // Наприклад:
    // const route = calculateRouteLogic(
    //     userLocation.latitude,
    //     userLocation.longitude,
    //     destinationLat,
    //     destinationLng,
    //     transportMode
    // );

    // res.json({ route });
});

module.exports = router;