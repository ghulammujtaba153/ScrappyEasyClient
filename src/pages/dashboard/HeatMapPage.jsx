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
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

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

  // Fetch recommended neighboring cities using coordinates
  const fetchRecommendedCities = async (exploredPoints) => {
    if (exploredPoints.length === 0) {
      setRecommendedCities([]);
      return;
    }

    setLoadingRecommendations(true);
    try {
      // Get unique coordinate clusters (group nearby points)
      const clusters = [];
      const processedCoords = new Set();
      
      exploredPoints.forEach(point => {
        // Round coordinates to 1 decimal place to cluster nearby points
        const coordKey = `${point.lat.toFixed(1)}-${point.lon.toFixed(1)}`;
        if (!processedCoords.has(coordKey)) {
          processedCoords.add(coordKey);
          clusters.push({
            lat: point.lat,
            lon: point.lon,
            city: point.city
          });
        }
      });

      // Get explored city names for filtering (normalize to lowercase)
      const exploredCityNames = new Set(
        exploredPoints
          .map(p => p.city?.toLowerCase().trim())
          .filter(c => c && c !== 'unknown')
      );

      // Also create a set of explored coordinate areas to filter nearby duplicates
      const exploredCoordAreas = new Set(
        exploredPoints.map(p => `${p.lat.toFixed(2)}-${p.lon.toFixed(2)}`)
      );

      // Fetch nearby cities for up to 5 coordinate clusters
      const clustersToCheck = clusters.slice(0, 5);
      const allNearbyCities = [];

      for (const cluster of clustersToCheck) {
        try {
          const response = await axios.get(`${BASE_URL}/api/location/nearby-cities`, {
            params: {
              lat: cluster.lat,
              lng: cluster.lon,
              limit: 20,
              radius: 150, // 150km radius
              minPopulation: 5000 // Only cities with population > 5000
            }
          });

          if (response.data?.success && response.data.cities) {
            response.data.cities.forEach(nearbyCity => {
              // Check if this city is already explored
              const cityNameLower = nearbyCity.city?.toLowerCase().trim();
              const cityAsciiLower = nearbyCity.city_ascii?.toLowerCase().trim();
              const coordArea = `${nearbyCity.lat.toFixed(2)}-${nearbyCity.lng.toFixed(2)}`;
              
              const isExplored = exploredCityNames.has(cityNameLower) ||
                                 exploredCityNames.has(cityAsciiLower) ||
                                 exploredCoordAreas.has(coordArea);
              
              if (!isExplored) {
                allNearbyCities.push({
                  ...nearbyCity,
                  sourceCity: cluster.city || 'Explored Area'
                });
              }
            });
          }
        } catch (err) {
          console.error('Error fetching nearby cities:', err);
        }
      }

      // Remove duplicates and sort by distance (lowest first)
      const uniqueNeighbors = [];
      const seenNeighbors = new Set();
      
      allNearbyCities
        .sort((a, b) => a.distance_km - b.distance_km) // Sort by lowest distance first
        .forEach(neighbor => {
          const key = neighbor.id || `${neighbor.city}-${neighbor.lat.toFixed(2)}`;
          if (!seenNeighbors.has(key)) {
            seenNeighbors.add(key);
            uniqueNeighbors.push(neighbor);
          }
        });

      setRecommendedCities(uniqueNeighbors.slice(0, 4)); // Limit to top 4 nearest recommendations
    } catch (error) {
      console.error('Error fetching recommended cities:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
    
    // Fetch recommended neighboring cities
    if (pointsWithDensity.length > 0) {
      fetchRecommendedCities(pointsWithDensity);
    }
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

    // Add circle markers with density-based colors (explored areas)
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

    // Add recommended cities as green markers
    if (showRecommendations && recommendedCities.length > 0) {
      recommendedCities.forEach(city => {
        // Calculate marker size based on population
        const popSize = city.population ? Math.min(Math.log10(city.population) * 3, 15) : 8;
        
        L.circleMarker([parseFloat(city.lat), parseFloat(city.lng)], {
          radius: popSize,
          fillColor: '#10B981', // Green color
          color: '#059669',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }).bindPopup(`
          <div style="min-width: 220px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px 4px 0 0;">
              <b style="font-size: 14px;">📍 Recommended Area</b>
            </div>
            <b style="font-size: 15px; color: #1f2937;">${city.city}</b><br/>
            <span style="color: #6b7280; font-size: 12px;">${city.admin_name || ''}, ${city.country}</span><br/>
            <hr style="margin: 8px 0; border-color: #e5e7eb;"/>
            ${city.population ? `<span style="color: #8b5cf6;">👥 Population: ${city.population.toLocaleString()}</span><br/>` : ''}
            <span style="color: #0ea5e9;">📏 Distance: ${city.distance_km} km</span><br/>
            ${city.sourceCity ? `<span style="color: #f59e0b; font-size: 11px;">Near: ${city.sourceCity}</span><br/>` : ''}
            <div style="margin-top: 8px; padding: 6px; background: #ecfdf5; border-radius: 4px; text-align: center;">
              <span style="color: #059669; font-weight: 600; font-size: 12px;">✨ Unexplored - Worth exploring!</span>
            </div>
          </div>
        `).addTo(map);
      });
    }

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [mapData, recommendedCities, showRecommendations]);

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

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Toggle Recommendations */}
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showRecommendations}
              onChange={(e) => setShowRecommendations(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Show Recommendations</span>
            {loadingRecommendations && (
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </label>

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
              
              {/* Recommendations Legend */}
              {showRecommendations && (
                <>
                  <div className="text-sm font-semibold mb-2 pt-2 border-t">Recommendations</div>
                  <div className="flex flex-col gap-1 text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                      <span className="text-green-700 font-medium">Unexplored Areas</span>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    💡 {recommendedCities.length} areas to explore
                  </div>
                </>
              )}
              
              <div className="text-xs text-gray-500 pt-2 border-t mt-2">Drag & zoom freely</div>
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
