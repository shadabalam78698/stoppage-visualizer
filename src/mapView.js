import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import moment from 'moment';
const MapView = ({ gpsData, stoppages }) => {
  const polyline = gpsData.map(point => [point.latitude, point.longitude]);

  return (
    <MapContainer center={[gpsData[0].latitude, gpsData[0].longitude]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={polyline} color="blue" />
      {stoppages.map((stoppage, index) => (
        <Marker key={index} position={stoppage.location}>
          <Popup>
            <div>
              <p><strong>Reach Time:</strong> {moment(stoppage.start).format('YYYY-MM-DD HH:mm:ss')}</p>
              <p><strong>End Time:</strong> {moment(stoppage.end).format('YYYY-MM-DD HH:mm:ss')}</p>
              <p><strong>Duration:</strong> {stoppage.duration.toFixed(2)} minutes</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;