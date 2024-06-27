import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShelterTypes, setSelectedShelterTypes] = useState([]);
  const [selectedTransportMode, setSelectedTransportMode] = useState('foot-walking');
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shelters');
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelters: ", error);
        setError("Failed to fetch shelters. Please try again later.");
      }
    };
    fetchShelters();
  }, []);

  const highlightShelter = (shelter) => {
    setSelectedShelter(shelter);
  };

  const calculateRoute = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/calculate-route', {
        selectedShelterTypes,
        selectedTransportMode,
        shelters,
        userLocation
      });
      setRoute(response.data);
    } catch (error) {
      console.error("Error calculating route: ", error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="App">
      <Sidebar
        shelters={shelters}
        selectedShelter={selectedShelter}
        selectedShelterTypes={selectedShelterTypes}
        setSelectedShelterTypes={setSelectedShelterTypes}
        selectedTransportMode={selectedTransportMode}
        setSelectedTransportMode={setSelectedTransportMode}
        calculateRoute={calculateRoute}
        onShelterSelect={highlightShelter}
      />
      <MapComponent
        shelters={shelters}
        selectedShelter={selectedShelter}
        selectedShelterTypes={selectedShelterTypes}
        onShelterSelect={highlightShelter}
        route={route} // Pass the route to MapComponent
        userLocation={userLocation}
        setUserLocation={setUserLocation}
      />
    </div>
  );
}

export default App;