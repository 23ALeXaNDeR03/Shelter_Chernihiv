import L from 'leaflet';
import React, { useEffect, useState } from 'react';

const MapComponent = ({ shelters, selectedShelterTypes, userLocation, setUserLocation }) => {
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);

    useEffect(() => {
        const initMap = () => {
            const map = L.map('map').setView([51.4982, 31.2893], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: ''  // Убираем атрибуцию
            }).addTo(map);

            map.on('click', function (e) {
                setUserLocation(e.latlng);
            });

            setMap(map);
        };

        initMap();
    }, []);

    useEffect(() => {
        if (map) {
            // Видаляємо всі мітки сховищ
            map.eachLayer(layer => {
                if (layer instanceof L.Marker && !layer.options.isUserLocation) {
                    map.removeLayer(layer);
                }
            });

            // Додаємо мітки сховищ
            shelters.filter(shelter => selectedShelterTypes.includes(shelter.type)).forEach(shelter => {
                const icon = L.icon({
                    iconUrl: `/images/${shelter.type}.png`,  // Путь к иконке
                    iconSize: [24, 24],
                });

                const marker = L.marker([shelter.latitude, shelter.longitude], { icon }).addTo(map);
                marker.on('click', () => {
                    highlightShelter(shelter);
                });
            });

            // Обновляем или добавляем маркер местоположения пользователя
            if (userLocation) {
                const userIcon = L.icon({
                    iconUrl: '/images/user-location.png',  // Путь к иконке для местоположения пользователя
                    iconSize: [24, 24],
                });

                if (userMarker) {
                    userMarker.setLatLng(userLocation);
                } else {
                    const newUserMarker = L.marker([userLocation.lat, userLocation.lng], {
                        isUserLocation: true,
                        icon: userIcon
                    }).addTo(map);
                    setUserMarker(newUserMarker);
                }

                map.setView([userLocation.lat, userLocation.lng], 15);
            }
        }
    }, [map, shelters, selectedShelterTypes, userLocation, userMarker]);

    const highlightShelter = (shelter) => {
        map.setView([shelter.latitude, shelter.longitude], 15);
        const selectedShelter = document.getElementById(`shelter-${shelter.id}`);
        const previouslySelected = document.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        if (selectedShelter) {
            selectedShelter.classList.add('selected');
        }
    };

    return (
        <div id="map" className="map-container"></div>
    );
};

export default MapComponent;
