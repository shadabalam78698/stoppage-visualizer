import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { detectStoppages, parseData } from './detectStop';
import 'leaflet/dist/leaflet.css';

// Helper to fix icon issue with React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const App = () => {
  const [data, setData] = useState([]);
  const [stoppages, setStoppages] = useState([]);
  const [threshold, setThreshold] = useState(1); // Stoppage threshold in minutes

  useEffect(() => {
    // Load and parse the CSV file
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const parsedData = parseData(result.data);
        console.log('Parsed Data:', parsedData);  // Add logging for debugging
        setData(parsedData);
      }
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const detectedStoppages = detectStoppages(data, threshold);
      console.log('Detected Stoppages:', detectedStoppages);  // Add logging for debugging
      setStoppages(detectedStoppages);
    }
  }, [data, threshold]);

  return (
    <div>
      <h1>Vehicle Stoppage Visualization</h1>
      <div>
        <label>Stoppage Threshold (minutes): </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </div>
      <MapContainer center={[12.9294916, 74.9173533]} zoom={13} style={{ height: '600px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={data.map(point => [point.latitude, point.longitude])} color="blue" />
        {stoppages.map((stoppage, index) => (
          <Marker key={index} position={[stoppage.location.lat, stoppage.location.lng]}>
            <Popup>
              <div>
                <p><strong>Reach Time:</strong> {stoppage.start.toString()}</p>
                <p><strong>End Time:</strong> {stoppage.end ? stoppage.end.toString() : 'N/A'}</p>
                <p><strong>Duration:</strong> {stoppage.duration} minutes</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
