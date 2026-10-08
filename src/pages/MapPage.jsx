import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {supabase} from '../lib/supabaseClient';
import {DUNGEON_STATES, TIER_NAMES} from '../lib/dungeonStates';

const MAP_CENTER = [-6.4375, 106.8185];

function makePopup(d) {
  const box = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = d.name;
  const info = document.createElement('div');
  info.textContent = `Tier ${d.tier} — ${TIER_NAMES[d.tier]}`;
  const status = document.createElement('div');
  status.textContent = `Status: ${DUNGEON_STATES[d.state].label}`;
  box.append(title, info, status);
  return box;
}

export default function MapPage() {
  const mapEl = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const map = L.map(mapEl.current, {zoomControl: false}).setView(MAP_CENTER, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      className: 'dark-tiles',
    }).addTo(map);

    let cancelled = false;
    supabase
      .from('dungeons')
      .select('*')
      .then(({data, error}) => {
        if (cancelled) return;
        if (error) return setError(error.message);
        data.forEach((d) => {
          const s = DUNGEON_STATES[d.state];
          const icon = L.divIcon({
            className: '',
            html: `<div class="dungeon-pin ${d.state}" style="--pin-color:${s.color};--pin-glow:${s.glow}"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          L.marker([d.latitude, d.longitude], {icon}).addTo(map).bindPopup(makePopup(d));
        });
      });

    return () => {
      cancelled = true;
      map.remove();
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-[#0A192F]">
      <div ref={mapEl} className="h-full w-full" />
      <Link to="/" className="absolute left-3 top-3 z-[1000] rounded-lg bg-[#0A192F]/90 px-3 py-2 text-sm text-[#00F2FF]">
        ← Profil
      </Link>
      {error && <p className="absolute bottom-3 left-3 z-[1000] rounded bg-[#0A192F]/90 p-2 text-sm text-red-400">Error: {error}</p>}
    </div>
  );
}
