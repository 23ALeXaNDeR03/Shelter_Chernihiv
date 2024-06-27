const axios = require('axios');
require('dotenv').config();


// Функція для обчислення відстані за допомогою формули Haversine
const haversineDistance = (coords1, coords2) => {
    const toRad = angle => (Math.PI / 180) * angle;
    const R = 6371; // Радіус Землі в км

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Функція для отримання 10 найближчих укриттів
const getNearestShelters = (userLocation, shelters) => {
    return shelters
        .map(shelter => ({
            ...shelter,
            distance: haversineDistance(userLocation, { latitude: shelter.latitude, longitude: shelter.longitude })
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
};

// Функція для отримання маршруту
const getRoute = async (start, end, profile) => {
    try {
        const apiKey = process.env.API_KEY;//Api
        const response = await axios.get(`https://api.openrouteservice.org/v2/directions/${profile}`, {
            params: {
                api_key: apiKey,
                start: `${start.longitude},${start.latitude}`,
                end: `${end.lng},${end.lat}`
            }
        });

        const routeData = response.data.features[0];
        const route = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distance = routeData.properties.summary.distance;
        return { route, distance };
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
};

// Основна функція для пошуку найкоротшого маршруту до одного з 10 найближчих укриттів
const findShortestRoute = async (userLocation, shelterType, profile, shelters) => {
    //запрос к бд
    const sheltersOfType = [];
    shelters.forEach(shelters => {
        if (shelterType.includes(shelters.sheltertype)) {
            sheltersOfType.push({ latitude: shelters.latitude, longitude: shelters.longitude });
        }
    });
    console.log("sheltersOfType : ", sheltersOfType);
    const nearestShelters = getNearestShelters(userLocation, sheltersOfType);
    console.log("nearestShelters ", nearestShelters);
    let shortestRoute = null;

    for (const sheltersOfType of nearestShelters) {
        const result = await getRoute(userLocation, { lat: sheltersOfType.latitude, lng: sheltersOfType.longitude }, profile);
        if (result && (!shortestRoute || result.distance < shortestRoute.distance)) {
            shortestRoute = { ...result };
        }
    }
    console.log("findRoute new route?: ", shortestRoute);
    return shortestRoute;
};

module.exports = findShortestRoute;

