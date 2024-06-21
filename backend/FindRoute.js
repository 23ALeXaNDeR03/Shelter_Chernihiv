import axios from 'axios';

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
    console.log(R*c);
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
        .slice(0, 5);
};

// Функція для отримання маршруту
const getRoute = async (start, end, profile) => {
    try {
        const apiKey = 'b3ce3597851110001cf6248329247b73ad04446ba774aa682b7f307';//Api
        const response = await axios.get(`https://api.openrouteservice.org/v2/directions/${profile}`, {
            params: {
                api_key: apiKey,
                start: `${start.lng},${start.lat}`,
                end: `${end.lng},${end.lat}`
            }
        });

        const routeData = response.data.routes[0];
        const route = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distance = routeData.summary.distance;
        return { route, distance};
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
};

// Основна функція для пошуку найкоротшого маршруту до одного з 10 найближчих укриттів
const findShortestRoute = async (userLocation, shelters, profile) => {
    const nearestShelters = getNearestShelters(userLocation, shelters);
    let shortestRoute = null;

    for (const shelter of nearestShelters) {
        const result = await getRoute(userLocation, { lat: shelter.latitude, lng: shelter.longitude }, profile);
        if (result && (!shortestRoute || result.distance < shortestRoute.distance)) {
            shortestRoute = { ...result, shelter };
        }
    }

    return shortestRoute;
};

export { findShortestRoute, getNearestShelters, getRoute };
