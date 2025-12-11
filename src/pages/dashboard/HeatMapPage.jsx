import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import * as d3 from 'd3';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

const HeatMapPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [mapData, setMapData] = useState([]);

  const extractCoordinates = (url) => {
    if (!url) return null;

    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lon: parseFloat(match[2])
        };
      }
    }
    return null;
  };

  const heatColor = d3
    .scaleLinear()
    .domain([1, 3, 6, 10, 20])
    .range(["#ffff00", "#ffae00", "#ff5e00", "#ff0000", "#8b0000"]);

  const fetchData = async () => {
    if (!user?._id && !user?.id) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/data/${user._id || user.id}`, {
        params: { limit: 1000 }
      });

      if (res.data?.success && res.data.data) {
        setOperations(res.data.data);
        processMapData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const processMapData = (data, operationId = 'all') => {
    let filteredData = data;
    if (operationId !== 'all') {
      filteredData = data.filter(record => record._id === operationId);
    }

    const allPoints = [];
    filteredData.forEach(record => {
      if (record.data && Array.isArray(record.data)) {
        record.data.forEach((item, index) => {
          if (item.googleMapsLink) {
            const coords = extractCoordinates(item.googleMapsLink);
            if (coords) {
              // Get city from cityData map using index as key
              const city = record.cityData && record.cityData[index.toString()] 
                ? record.cityData[index.toString()] 
                : 'Unknown';
              
              allPoints.push({
                lat: coords.lat,
                lon: coords.lon,
                title: item.title || 'Unknown',
                rating: item.rating || 'N/A',
                address: item.address || '',
                city: city,
                phone: item.phone || ''
              });
            }
          }
        });
      }
    });

    const pointsWithDensity = allPoints.map(p => {
      const density = allPoints.filter(q => {
        const distance = Math.sqrt(
          Math.pow(p.lat - q.lat, 2) + Math.pow(p.lon - q.lon, 2)
        );
        return distance < 0.4;
      }).length;

      return { ...p, density };
    });

    setMapData(pointsWithDensity);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (mapData.length === 0) return;

    // Remove old map if exists
    const mapContainer = document.getElementById("leaflet-map");
    if (mapContainer) {
      mapContainer.innerHTML = '';
    }

    // Calculate center from data
    const avgLat = mapData.reduce((sum, p) => sum + p.lat, 0) / mapData.length;
    const avgLon = mapData.reduce((sum, p) => sum + p.lon, 0) / mapData.length;

    const map = L.map("leaflet-map", {
      center: [avgLat, avgLon],
      zoom: 10,
      worldCopyJump: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Add circle markers with density-based colors
    mapData.forEach(p => {
      const color = heatColor(p.density);
      
      L.circleMarker([p.lat, p.lon], {
        radius: 8 + (p.density * 0.5),
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`
        <div style="min-width: 200px;">
          <b style="font-size: 14px;">${p.title}</b><br/>
          <span style="color: #2563eb; font-weight: 600;">🏙️ ${p.city}</span><br/>
          ${p.rating !== 'N/A' ? `<span style="color: #f59e0b;">⭐ ${p.rating}</span><br/>` : ''}
          ${p.phone ? `<span style="color: #059669;">📞 ${p.phone}</span><br/>` : ''}
          <span style="color: #6b7280; font-size: 12px;">${p.address}</span><br/>
          <span style="color: #dc2626; font-size: 12px; font-weight: 600;">🔥 Density: ${p.density}</span>
        </div>
      `).addTo(map);
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [mapData]);

  const handleOperationChange = (value) => {
    setSelectedOperation(value);
    processMapData(operations, value);
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Visualization</h1>
          <p className="text-gray-600">
            Geographic heatmap showing business locations and density
          </p>
        </div>

        <div>
          <select
            value={selectedOperation}
            onChange={(e) => handleOperationChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            style={{ width: '300px' }}
          >
            <option value="all">All Operations</option>
            {operations.map(op => (
              <option key={op._id} value={op._id}>
                {op.searchString} ({op.data?.length || 0} records)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : mapData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>No location data available</p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md">
              <div className="text-sm font-semibold mb-2">Heat Legend</div>
              <div className="flex flex-col gap-1 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8b0000' }}></div>
                  <span>Very High (20+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff0000' }}></div>
                  <span>High (10-20)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff5e00' }}></div>
                  <span>Medium (6-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffae00' }}></div>
                  <span>Low (3-6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffff00' }}></div>
                  <span>Very Low (1-3)</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">Drag & zoom freely</div>
              <div className="text-xs mt-2">
                Total Points: <b>{mapData.length}</b>
              </div>
            </div>

            <div
              id="leaflet-map"
              style={{ width: "100%", height: "650px", borderRadius: "12px" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatMapPage;
