import React, { useEffect, useState } from 'react';

const Sidebar = ({ shelters, calculateRoute, onShelterSelect, selectedShelterTypes,
    setSelectedShelterTypes, selectedTransportMode, setSelectedTransportMode }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        if (shelters.length > 0) {
            const allTypes = [...new Set(shelters.map(shelter => shelter.sheltertype))];
            setSelectedShelterTypes(allTypes);
        }
    }, [shelters, setSelectedShelterTypes]);

    const filteredShelters = shelters.filter(shelter =>
        shelter.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTransportToggle = (mode) => {
        setSelectedTransportMode(mode);
    };

    const handleSearchIconClick = () => {
        if (filteredShelters.length > 0) {
            onShelterSelect(filteredShelters[0]);
        }
    };

    const toggleShelterType = (type) => {
        setSelectedShelterTypes(prevSelectedShelterTypes =>
            prevSelectedShelterTypes.includes(type)
                ? prevSelectedShelterTypes.filter(t => t !== type)
                : [...prevSelectedShelterTypes, type]
        );
    };

    const typeMapping = {
        'найпростіше': 'simple',
        'протирадіаційне': 'antiradiation',
        'цивільного захисту': 'civildefense'
    };

    const shelterTypes = [...new Set(shelters.map(shelter => shelter.sheltertype))];

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="container">
            <div className="sidebar">
                <div className={`header ${isSearchFocused ? 'expanded' : ''}`}>
                    <h2>Захисні споруди цивільного захисту м. Чернігова</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Пошук..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchTerm && (
                            <span className="clear-icon" onClick={handleClearSearch}>✖</span>
                        )}
                        <span className="search-icon" onClick={handleSearchIconClick}>🔍</span>
                    </div>
                </div>

                <div className={`shelter-types ${isSearchFocused ? 'hidden' : ''}`}>
                    {shelterTypes.map(type => (
                        <div key={type} className="shelter-type-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedShelterTypes.includes(type)}
                                    onChange={() => toggleShelterType(type)}
                                />
                                {capitalizeFirstLetter(type)}
                            </label>
                            {selectedShelterTypes.includes(type) && (
                                <ul className="shelterList">
                                    {filteredShelters.filter(shelter => shelter.sheltertype === type).map(shelter => (
                                        <li key={shelter.id} id={`shelter-${shelter.id}`} className="shelter-item" onClick={() => onShelterSelect(shelter)}>
                                            <div className="shelter-info">
                                                <div className="shelter-details">
                                                    <img src={`/img/${typeMapping[shelter.sheltertype]}.png`} alt={shelter.sheltertype} className="shelter-icon" />
                                                    <h3 className="shelter-name">{shelter.address}</h3>
                                                </div>
                                                <p className="shelter-notes">{shelter.notes}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className={`transport-toggle ${isSearchFocused ? 'hidden' : ''}`}>
                    <button
                        className={`toggle-btn ${selectedTransportMode === 'foot-walking' ? 'active' : ''}`}
                        onClick={() => handleTransportToggle('foot-walking')}
                    >
                        <img src='../img/walking.png' alt="Walking" />
                    </button>
                    <button
                        className={`toggle-btn ${selectedTransportMode === 'driving-car' ? 'active' : ''}`}
                        onClick={() => handleTransportToggle('driving-car')}
                    >
                        <img src='../img/car.png' alt="Driving" />
                    </button>
                </div>
                <button className={`route-btn ${isSearchFocused ? 'hidden' : ''}`} onClick={calculateRoute}>
                    Прокласти маршрут
                </button>
            </div>
            <div id="map"></div>
        </div>
    );
};

export default Sidebar;

