// Імпорт необхідних бібліотек
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';

const Map = () => {
    // Використання useState для зберігання даних укриттів, поточного місцезнаходження користувача та маршруту
    const [shelters, setShelters] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState(null);

    // Використання useEffect для завантаження даних про укриття з бекенду
    useEffect(() => {
        axios.get('/api/shelters')
            .then(response => setShelters(response.data)) // Зберігання даних укриттів у стані
            .catch(error => console.error('Error fetching shelters:', error)); // Виведення помилки у разі невдачі
    }, []);

    // Використання useEffect для обчислення маршруту до найближчого укриття при зміні місцезнаходження користувача або даних укриттів
    useEffect(() => {
        if (userLocation && shelters.length > 0) {
            const fetchRoute = async () => {
                const nearestShelter = shelters[0]; // Placeholder для найближчого укриття
                const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
                    params: {
                        api_key: '', // Ваш API ключ
                        start: `${userLocation.lng},${userLocation.lat}`, // Початкова точка (місцезнаходження користувача)
                        end: `${nearestShelter.longitude},${nearestShelter.latitude}` // Кінцева точка (місцезнаходження укриття)
                    }
                });
                const route = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Обробка координат маршруту
                setRoute(route); // Збереження маршруту у стані
            };

            fetchRoute();
        }
    }, [userLocation, shelters]);

    // Компонент для обробки кліків на карту та встановлення місцезнаходження користувача
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                setUserLocation(e.latlng); // Встановлення координат місцезнаходження користувача
            },
        });
        return null;
    };

    return (
        <MapContainer center={[51.4982, 31.2893]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Використання OpenStreetMap тайлів
            />
            {shelters.map(shelter => (
                <Marker key={shelter.id} position={[shelter.latitude, shelter.longitude]} /> // Відображення маркерів укриттів
            ))}
            {userLocation && <Marker position={userLocation} />} // Відображення маркеру місцезнаходження користувача
            {route && <Polyline positions={route} color="blue" />} // Відображення маршруту на карті
            <MapClickHandler /> // Компонент для обробки кліків на карту
        </MapContainer>
    );
};

export default Map;
