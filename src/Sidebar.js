import React, { useState } from 'react';

const Sidebar = ({ shelters, setTransportMode, calculateRoute, selectedShelterTypes, toggleShelterType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransportMode, setSelectedTransportMode] = useState('walking');

    const highlightShelter = (shelter) => {
        const selectedShelter = document.getElementById(`shelter-${shelter.id}`);
        const previouslySelected = document.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        if (selectedShelter) {
            selectedShelter.classList.add('selected');
        }
    };

    const filteredShelters = shelters.filter(shelter =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTransportToggle = (mode) => {
        setSelectedTransportMode(mode);
        setTransportMode(mode);
    };

    const shelterTypes = [...new Set(shelters.map(shelter => shelter.type))];

    return (
        <div className="sidebar">
            <div className="header">
                <h2>Захисні споруди цивільного захисту</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Пошук..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="transport-toggle">
                    <button
                        className={`toggle-btn ${selectedTransportMode === 'walking' ? 'active' : ''}`}
                        onClick={() => handleTransportToggle('walking')}
                    >
                        🚶‍♂️
                    </button>
                    <button
                        className={`toggle-btn ${selectedTransportMode === 'driving' ? 'active' : ''}`}
                        onClick={() => handleTransportToggle('driving')}
                    >
                        🚗
                    </button>
                </div>
                <button className="route-btn" onClick={calculateRoute}>
                    Проложити маршрут
                </button>
            </div>
            {shelterTypes.map(type => (
                <div key={type} className="shelter-type-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedShelterTypes.includes(type)}
                            onChange={() => toggleShelterType(type)}
                        />
                        <img src={`/images/${type}.png`} alt={type} className="type-icon" />
                        {type}
                    </label>
                    <ul id="shelterList">
                        {filteredShelters.filter(shelter => shelter.type === type).map(shelter => (
                            <li key={shelter.id} id={`shelter-${shelter.id}`} className="shelter-item" onClick={() => highlightShelter(shelter)}>
                                <div className="shelter-info">
                                    <img src={`/images/${shelter.type}.png`} alt={shelter.type} className="shelter-icon" />
                                    <h3 className="shelter-name">{shelter.name}</h3>
                                    <p className="shelter-address">{shelter.address}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
