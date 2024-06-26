import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

const MapComponent = ({ shelters, selectedShelter, onShelterSelect, selectedShelterTypes, route }) => {
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const userMarkerRef = useRef(null);
    const routeRef = useRef(null); // Reference to the route polyline

    useEffect(() => {
        console.log('Selected Shelter Types:', selectedShelterTypes);
    }, [selectedShelterTypes]);

    const typeMapping = {
        'найпростіше': 'simple',
        'протирадіаційне': 'antiradiation',
        'цивільного захисту': 'civildefense'
    };

    const sendUserLocationToBackend = async (location) => {
        try {
            await axios.post('http://localhost:5000/api/user-location', location);
        } catch (error) {
            console.error('Failed to send user location to backend:', error);
        }
    };

    const initializeMap = useCallback(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([51.4982, 31.2893], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);

            mapRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                const location = { latitude: lat, longitude: lng };
                setUserLocation(location);
                sendUserLocationToBackend(location);
            });
        }
    }, []);

    const updateUserMarker = useCallback(() => {
        if (mapRef.current && userLocation) {
            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
            } else {
                const userIcon = L.icon({
                    iconUrl: '/img/user-location.png',
                    iconSize: [24, 24]
                });
                userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
                    .addTo(mapRef.current);
            }
        }
    }, [userLocation]);

    const updateShelterMarkers = useCallback(() => {
        if (mapRef.current) {
            // Видалення всіх існуючих маркерів
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};

            shelters.forEach(shelter => {
                if (selectedShelterTypes.includes(shelter.sheltertype)) {
                    const shelterIcon = L.icon({
                        iconUrl: `/img/${typeMapping[shelter.sheltertype]}.png`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 24],
                        popupAnchor: [0, -24]
                    });

                    const shelterMarker = L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon })
                        .addTo(mapRef.current);

                    shelterMarker.bindPopup(`<b>${shelter.address}</b><br>Сховище на ${shelter.capacity} чоловік<br>Тип: ${shelter.sheltertype}<br>Нотатка: ${shelter.notes}`);
                    shelterMarker.on('click', () => onShelterSelect(shelter));

                    markersRef.current[shelter.id] = shelterMarker;
                }
            });
        }
    }, [shelters, selectedShelterTypes, onShelterSelect, typeMapping]);


    const highlightSelectedShelter = useCallback(() => {
        if (selectedShelter && mapRef.current) {
            const marker = markersRef.current[selectedShelter.id];
            if (marker) {
                marker.openPopup();
                mapRef.current.flyTo([selectedShelter.latitude, selectedShelter.longitude], 16);
            }
        }
    }, [selectedShelter]);

    const updateRoute = useCallback(() => {
        if (mapRef.current && route) {
            // Видалити попередній маршрут, якщо він існує
            if (routeRef.current) {
                routeRef.current.remove();
            }

            // Створюємо новий маршрут
            const latlngs = route.map(point => [point.latitude, point.longitude]);
            routeRef.current = L.polyline(latlngs, { color: 'blue' }).addTo(mapRef.current);

            // Підгонка карти до меж маршруту
            mapRef.current.fitBounds(routeRef.current.getBounds());
        }
    }, [route]);

    useEffect(() => {
        initializeMap();
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [initializeMap]);

    useEffect(() => {
        updateUserMarker();
    }, [updateUserMarker]);

    useEffect(() => {
        updateShelterMarkers();
    }, [updateShelterMarkers]);

    useEffect(() => {
        highlightSelectedShelter();
    }, [highlightSelectedShelter]);

    useEffect(() => {
        updateRoute();
    }, [updateRoute]);

    return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
};

export default MapComponent;