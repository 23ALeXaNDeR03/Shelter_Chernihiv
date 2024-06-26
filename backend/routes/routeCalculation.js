const express = require('express');
const router = express.Router();
const findShortestRoute = require('../api/findRoute');

router.post('/', async (req, res) => {
    console.log("обрабатываем функцию по поиску");
    const { selectedShelterTypes, selectedTransportMode, shelters, userLocation } = req.body;

    console.log("shelters: ", shelters);
    console.log("userLocation: ", userLocation);
    console.log("selectedShelterTypes: ", selectedShelterTypes);
    console.log("selectedTransportMode: ", selectedTransportMode);

    try {
        const shortestRoute = await findShortestRoute(userLocation, selectedShelterTypes, selectedTransportMode, shelters);
        
        if (shortestRoute) {
            console.log("shortestRoute: ", shortestRoute.route);

            const newRoute = shortestRoute.route;

            res.json({ newRoute });
        } else {
            res.status(404).json({ error: "Shortest route not found" });
        }
    } catch (error) {
        console.error("Error finding shortest route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;