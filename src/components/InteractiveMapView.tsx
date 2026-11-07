import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Building2,
  PackageCheck,
  Layers,
  Maximize2,
  Minimize2,
  Compass,
  RotateCcw
} from 'lucide-react';
import { CityOption, VideoItem } from '../types';

interface InteractiveMapViewProps {
  cities: CityOption[];
  selectedCityId?: string;
  onSelectCity: (cityId: string) => void;
  onNavigateTab: (tab: any) => void;
  products?: VideoItem[];
}

type MapLayerType = 'satellite' | 'streets' | 'dark';

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  cities,
  selectedCityId,
  onSelectCity,
  onNavigateTab,
  products = []
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [activeCityId, setActiveCityId] = useState<string>(selectedCityId || (cities[0]?.id ?? 'casablanca'));
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locating, setLocating] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [closestCity, setClosestCity] = useState<CityOption | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const activeCity = cities.find((c) => c.id === activeCityId) || cities[0];

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.hubName && c.hubName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Haversine formula to compute km between two coordinates
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Helper to change map layer style (Google Maps Normal, Google Satellite Hybride, Dark VIP)
  const changeMapLayer = useCallback((layerType: MapLayerType) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let layerUrl = '';
    let attribution = '';
    let maxZoom = 20;
    let subdomains: any = ['0', '1', '2', '3'];

    if (layerType === 'streets') {
      // Official Google Maps Morocco View (gl=ma eliminates any border or dashed line between Morocco & Sahara)
      layerUrl = 'https://mt{s}.google.com/vt/lyrs=m&gl=ma&hl=fr&x={x}&y={y}&z={z}';
      attribution = 'Google Maps Maroc';
      maxZoom = 20;
      subdomains = ['0', '1', '2', '3'];
    } else if (layerType === 'satellite') {
      // Google Maps Satellite Hybride Maroc (gl=ma eliminates any border or dashed line)
      layerUrl = 'https://mt{s}.google.com/vt/lyrs=y&gl=ma&hl=fr&x={x}&y={y}&z={z}';
      attribution = 'Google Maps Satellite Maroc';
      maxZoom = 20;
      subdomains = ['0', '1', '2', '3'];
    } else {
      // Dark VIP using Google Maps gl=ma with dark filter (zero separating border line)
      layerUrl = 'https://mt{s}.google.com/vt/lyrs=m&gl=ma&hl=fr&x={x}&y={y}&z={z}';
      attribution = 'Google Maps VIP';
      maxZoom = 20;
      subdomains = ['0', '1', '2', '3'];
    }

    const newTileLayer = L.tileLayer(layerUrl, {
      subdomains,
      maxZoom,
      attribution,
      className: layerType === 'dark' ? 'map-tiles-dark-vip' : ''
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
    setActiveLayer(layerType);
  }, []);

  // Reset to full Morocco view (covering complete Kingdom from Tangier to Lagouira / Guerguerat)
  const handleResetMoroccoView = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(
      [
        [20.4, -17.5], // Extrême Sud : Lagouira, Guerguerat & Sahara Marocain Intégral
        [36.1, -1.0]  // Extrême Nord : Tanger & Méditerranée
      ],
      { padding: [15, 15], animate: true, duration: 1.2 }
    );
  }, []);

  const createCityPinHtml = (city: CityOption, isSelected: boolean) => {
    const pinColor = isSelected ? '#9333EA' : '#EA4335';
    const innerColor = isSelected ? '#6B21A8' : '#B91C1C';
    const pinSize = isSelected ? 34 : 26;
    const pinHeight = isSelected ? 44 : 34;

    return `
      <div class="relative flex flex-col items-center cursor-pointer select-none group" style="transform: translate(-50%, -100%);">
        <!-- Google Maps Classic Teardrop Pin -->
        <div class="transition-transform transform group-hover:scale-125 ${isSelected ? 'scale-110 drop-shadow-[0_0_12px_rgba(147,51,234,0.7)]' : 'drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]'}">
          <svg width="${pinSize}" height="${pinHeight}" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 20 12 32 12 32C12 32 24 20 24 12C24 5.37258 18.6274 0 12 0Z" fill="${pinColor}"/>
            <circle cx="12" cy="11.5" r="5" fill="#FFFFFF"/>
            <circle cx="12" cy="11.5" r="2.5" fill="${innerColor}"/>
          </svg>
        </div>
        <!-- Clean City Label Pill -->
        <div class="mt-0.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border ${
          isSelected 
            ? 'border-purple-600 ring-2 ring-purple-500/50 text-purple-900 font-black' 
            : 'border-zinc-300 text-zinc-900 font-bold'
        } text-[9.5px] whitespace-nowrap shadow-md flex items-center gap-1">
          <span>${city.flag || '🇲🇦'}</span>
          <span>${city.name}</span>
        </div>
      </div>
    `;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 50);
      return;
    }

    const initialLat = activeCity?.lat || 31.7917;
    const initialLng = activeCity?.lng || -7.0926;

    const map = L.map(mapContainerRef.current, {
      center: [28.2, -9.5], // Centre géographique officiel du Maroc complet (Tanger à Lagouira)
      zoom: 5,
      minZoom: 4,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });

    // Default tile: Real Google Maps with gl=ma & hl=fr (Maroc complet sans aucun trait de frontière)
    const initialTiles = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=m&gl=ma&hl=fr&x={x}&y={y}&z={z}',
      {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: 'Google Maps Maroc'
      }
    ).addTo(map);

    tileLayerRef.current = initialTiles;
    mapInstanceRef.current = map;

    // Zoom controls in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial fit: Carte du Maroc Complète de Tanger jusqu'à Lagouira (Sahara marocain 100% visible)
    map.fitBounds(
      [
        [20.4, -17.5], // Sud Sahara : Lagouira
        [36.1, -1.0]  // Nord : Tanger
      ],
      { padding: [15, 15] }
    );

    // Render City Markers with authentic Google Maps pins
    cities.forEach((city) => {
      const isSelected = city.id === activeCityId;
      
      const customIcon = L.divIcon({
        className: 'custom-city-pin',
        html: createCityPinHtml(city, isSelected),
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setActiveCityId(city.id);
        map.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
      });

      markersRef.current[city.id] = marker;
    });

    // CRITICAL: Multiple invalidateSize calls to ensure map renders 100% full view inside tab transitions
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 700);

    // ResizeObserver to automatically resize map whenever container dimensions change
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker icons when activeCityId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    cities.forEach((city) => {
      const marker = markersRef.current[city.id];
      if (!marker) return;

      const isSelected = city.id === activeCityId;
      const customIcon = L.divIcon({
        className: 'custom-city-pin',
        html: createCityPinHtml(city, isSelected),
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      marker.setIcon(customIcon);
    });
  }, [activeCityId, cities]);

  // Handle City Card Click
  const handleSelectCityCard = (city: CityOption) => {
    setActiveCityId(city.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
    }
  };

  // Locate user via GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;

          // Remove old user marker
          if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
          if (userCircleRef.current) map.removeLayer(userCircleRef.current);

          // User Marker Icon
          const userIcon = L.divIcon({
            className: 'user-gps-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute -inset-3 bg-emerald-500/40 rounded-full animate-ping"></div>
                <div class="relative w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-black font-black text-[10px]">
                  📍
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          userCircleRef.current = L.circle([latitude, longitude], {
            radius: Math.max(accuracy, 100),
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.15,
            weight: 1
          }).addTo(map);

          // Find closest Moroccan city
          let minDistance = Infinity;
          let nearest = cities[0];

          cities.forEach((c) => {
            const dist = getDistanceKm(latitude, longitude, c.lat, c.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = c;
            }
          });

          setClosestCity(nearest);
          setActiveCityId(nearest.id);

          // Zoom to show both user and closest city
          const group = L.featureGroup([
            userMarkerRef.current,
            markersRef.current[nearest.id] || L.marker([nearest.lat, nearest.lng])
          ]);
          map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 13 });
        }

        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocating(false);
        setGeoError("Impossible de récupérer votre position. Veuillez vérifier vos autorisations GPS.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Header with title & GPS button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#140B26] via-[#100820] to-[#0D0618] p-4 rounded-3xl border border-purple-900/40 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
            <Compass className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
              Carte & Réseau Officiel
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
                100% Maroc
              </span>
            </h2>
            <p className="text-xs text-purple-300/80">
              {cities.length} Villes & Hubs de livraison couverts partout au Royaume
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset Morocco View */}
          <button
            onClick={handleResetMoroccoView}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-purple-200 border border-purple-800/40 font-bold text-xs tracking-wider uppercase transition cursor-pointer"
            title="Vue d'ensemble du Maroc"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Vue Globale</span>
          </button>

          {/* Locate me button */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.45)] disabled:opacity-50 cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Recherche GPS...' : 'Ma position GPS'}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {closestCity && userCoords && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs shadow-lg">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span>Hub le plus proche détecté : <strong className="text-white font-black text-sm">{closestCity.name}</strong></span>
              <span className="text-[10px] text-emerald-400/80 block">Distance estimée : {getDistanceKm(userCoords.lat, userCoords.lng, closestCity.lat, closestCity.lng)} km de votre position</span>
            </div>
          </div>
          <button 
            onClick={() => handleSelectCityCard(closestCity)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
          >
            Sélectionner
          </button>
        </div>
      )}

      {/* Search Input with quick clear */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une ville (Casablanca, Rabat, Marrakech, Tanger, Fès, Dakhla...)"
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0D071B] border border-purple-900/60 text-white placeholder-purple-400/40 text-xs focus:outline-none focus:border-purple-400 transition-colors shadow-inner"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-white"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Quick City Horizontal Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
        {filteredCities.map((city) => {
          const isSelected = city.id === activeCityId;
          return (
            <button
              key={city.id}
              onClick={() => handleSelectCityCard(city)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.6)] scale-[1.02]'
                  : 'bg-[#120A22] text-purple-300 hover:text-white border-purple-900/40 hover:border-purple-600/60'
              }`}
            >
              <span>📍 {city.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/30 text-white font-black' : 'bg-purple-950/60 text-purple-400'}`}>
                {city.deliveryTime ? city.deliveryTime.split('&')[0].trim() : '24h'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Professional Interactive Map Container with full Morocco height */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-white transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[500px] sm:h-[620px]'
      }`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Controls: Map Style Switcher (Google Maps Normal, Satellite Hybride, Nuit VIP, Reset Maroc) */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center bg-[#0B0616]/95 backdrop-blur-md rounded-2xl border border-purple-500/40 p-1 shadow-xl gap-1">
          <button
            onClick={() => changeMapLayer('streets')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'streets'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            🗺️ Google Maps
          </button>
          <button
            onClick={() => changeMapLayer('satellite')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'satellite'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => changeMapLayer('dark')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            🌙 Nuit VIP
          </button>
          <button
            onClick={handleResetMoroccoView}
            className="px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/20 transition cursor-pointer flex items-center gap-1"
            title="Afficher le Maroc complet sans coupure"
          >
            🇲🇦 Maroc Complet
          </button>
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
          }}
          className="absolute bottom-3 right-3 z-[1000] p-2.5 rounded-2xl bg-[#0B0616]/90 backdrop-blur-md border border-purple-500/40 text-purple-300 hover:text-white transition shadow-xl cursor-pointer"
          title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Active City indicator badge */}
        <div className="absolute bottom-3 left-3 z-[1000] flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-[#0B0616]/90 backdrop-blur-md border border-purple-500/40 text-[11px] font-bold text-white shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hub sélectionné : <strong className="text-purple-300">{activeCity.name}</strong></span>
        </div>
      </div>

      {/* Selected City Detailed Info Card */}
      {activeCity && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#130A24] via-[#0E061B] to-[#090312] border border-purple-800/50 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇲🇦</span>
                <h3 className="text-xl font-black text-white tracking-wide uppercase">
                  {activeCity.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Hub Actif
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                {activeCity.hubName || `Hub Central ${activeCity.name}`}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-purple-400/80 font-bold block">
                Délai estimé
              </span>
              <span className="text-xs font-black text-purple-200 flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {activeCity.deliveryTime || '24h - 48h'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-[#170D2D]/60 border border-purple-900/40">
              <span className="text-[10px] uppercase font-bold text-purple-400/80 flex items-center gap-1">
                <PackageCheck className="w-3 h-3 text-purple-400" /> Stock Live
              </span>
              <p className="text-sm font-black text-white mt-0.5">
                {products.length} références
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#170D2D]/60 border border-purple-900/40">
              <span className="text-[10px] uppercase font-bold text-purple-400/80 flex items-center gap-1">
                <Truck className="w-3 h-3 text-purple-400" /> Expédition
              </span>
              <p className="text-sm font-black text-white mt-0.5">
                Discrète & Sécurisée
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#170D2D]/60 border border-purple-900/40">
              <span className="text-[10px] uppercase font-bold text-purple-400/80 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" /> Qualité
              </span>
              <p className="text-sm font-black text-purple-200 mt-0.5">
                100% Vérifié Fresh Genetics 💎
              </p>
            </div>
          </div>

          {activeCity.address && (
            <p className="text-[11px] text-zinc-400 italic">
              Zone couverte : {activeCity.address} et agglomérations voisines.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={() => {
                onSelectCity(activeCity.id);
                onNavigateTab('catalog');
              }}
              className="w-full flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(139,92,246,0.45)] active:scale-[0.98] cursor-pointer"
            >
              <span>Commander pour {activeCity.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {selectedCityId === activeCity.id ? (
              <span className="px-4 py-3 rounded-2xl bg-purple-950/60 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ville active
              </span>
            ) : (
              <button
                onClick={() => onSelectCity(activeCity.id)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#1A0E34] hover:bg-[#25154A] text-purple-200 border border-purple-700/50 text-xs font-bold transition-colors cursor-pointer"
              >
                Définir par défaut
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
