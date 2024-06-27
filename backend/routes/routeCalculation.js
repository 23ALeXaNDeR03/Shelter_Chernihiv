const express = require('express');
const router = express.Router();
const findShortestRoute = require('../api/findRoute');

router.post('/', async (req, res) => {
    const { selectedShelterTypes, selectedTransportMode, shelters, userLocation } = req.body;

    try {
        const shortestRoute = await findShortestRoute(userLocation, selectedShelterTypes, selectedTransportMode, shelters);

        if (shortestRoute) {
            const newRoute = shortestRoute.route;

            res.json({ newRoute });
        } else {
            res.status(404).json({ error: "Shortest route not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;