import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MapComponent from './Map';
import Sidebar from './Sidebar';
import './styles.css';

const App = () => {
  const [shelters, setShelters] = useState([]);
  const [transportMode, setTransportMode] = useState('walking');
  const [selectedShelterTypes, setSelectedShelterTypes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetch('/api/shelters');
        const data = await response.json();
        setShelters(data);

        // Инициализация всех типов укрытий как выбранных по умолчанию
        const allTypes = [...new Set(data.map(shelter => shelter.type))];
        setSelectedShelterTypes(allTypes);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    };

    fetchShelters();
  }, []);

  const calculateRoute = async () => {
    if (!userLocation) {
      alert('Выберите свое местоположение на карте.');
      return;
    }

    try {
      const nearestShelter = shelters.filter(shelter => selectedShelterTypes.includes(shelter.type))[0];
      const response = await axios.get(`https://api.openrouteservice.org/v2/directions/${transportMode}-car`, {
        params: {
          api_key: 'YOUR_API_KEY',  // Замените на ваш ключ API
          start: `${userLocation.lng},${userLocation.lat}`,
          end: `${nearestShelter.longitude},${nearestShelter.latitude}`
        }
      });
      console.log(response.data);
      // Обработка и отображение маршрута на карте
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const toggleShelterType = (type) => {
    setSelectedShelterTypes(prevTypes =>
      prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <div className="container">
      <Sidebar
        shelters={shelters}
        setTransportMode={setTransportMode}
        calculateRoute={calculateRoute}
        selectedShelterTypes={selectedShelterTypes}
        toggleShelterType={toggleShelterType}
      />
      <MapComponent
        shelters={shelters}
        selectedShelterTypes={selectedShelterTypes}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        transportMode={transportMode}
      />
    </div>
  );
};

export default App;
