const axios = require('axios');


// Функція для обчислення відстані за допомогою формули Haversine
const haversineDistance = (coords1, coords2) => {
    const toRad = angle => (Math.PI / 180) * angle;
    const R = 6371; // Радіус Землі в км

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Функція для отримання 10 найближчих укриттів
const getNearestShelters = (userLocation, shelters) => {
    return shelters
        .map(shelter => ({
            ...shelter,
            distance: haversineDistance(userLocation, { lat: shelter.latitude, lng: shelter.longitude })
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
};

// Функція для отримання маршруту
const getRoute = async (start, end, profile) => {
    try {
        const apiKey = '5b3ce3597851110001cf6248d32b411e67834fcfb2ef1e7c726854c3';//Api
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
        return { route, distance};
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
            sheltersOfType.push({latitude: shelters.latitude, longitude: shelters.longitude});
        }
    });
    console.log("sheltersOfType : ", sheltersOfType);
    const nearestShelters = getNearestShelters(userLocation, sheltersOfType);
    let shortestRoute = null;
    
    for (const sheltersOfType of nearestShelters) {
        const result = await getRoute(userLocation, { lat: sheltersOfType.latitude, lng: sheltersOfType.longitude }, profile);
        if (result && (!shortestRoute || result.distance < shortestRoute.distance)) {
            shortestRoute = { ...result};
        }
    }
    console.log("findRoute new route?: ", shortestRoute);
    return shortestRoute;
};

module.exports = findShortestRoute;