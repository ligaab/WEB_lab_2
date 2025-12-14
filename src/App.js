import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

function App() {
  const [countries, setCountries] = useState([]);

  // Ielādē COVID-19 datus
  useEffect(() => {
    axios
      .get('https://disease.sh/v3/covid-19/countries')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Aprēķina globālo statistiku
  const totalCases = countries.reduce((sum, c) => sum + c.cases, 0);
  const totalDeaths = countries.reduce((sum, c) => sum + c.deaths, 0);
  const totalRecovered = countries.reduce((sum, c) => sum + c.recovered, 0);

  return (
    <div style={{ height: '99vh', width: '99%' }}>

      {/* == STATISTIKAS PANELIS == */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        background: '#c5c1c1ff'
      }}>
        <div style={boxStyle}>
          <h3>Pasaulē saslimušie</h3>
          <p>{totalCases.toLocaleString()}</p>
        </div>

        <div style={{ ...boxStyle, borderColor: 'red' }}>
          <h3>Pasaulē mirušie</h3>
          <p>{totalDeaths.toLocaleString()}</p>
        </div>

        <div style={{ ...boxStyle, borderColor: 'green' }}>
          <h3>Pasaulē izārstētie</h3>
          <p>{totalRecovered.toLocaleString()}</p>
        </div>
      </div>

      {/* ===== KARTE ===== */}
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '81vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {countries.map((country) => (
          <CircleMarker
            key={country.country}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            radius={Math.sqrt(country.cases) / 100}
            fillOpacity={0.7}
            stroke={false}
          >
            <Popup>
              <strong>{country.country}</strong><br />
              Saslimušie: {country.cases}<br />
              Mirušie: {country.deaths}<br />
              Izārstējušies: {country.recovered}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

    </div>
  );
}

// Stils statistikas kastēm
const boxStyle = {
  border: '4px solid #2c2c2cff',
  borderRadius: '11px',
  padding: '11px 21px',
  width: '200px',
  textAlign: 'center',
  background: 'white'
};

export default App;