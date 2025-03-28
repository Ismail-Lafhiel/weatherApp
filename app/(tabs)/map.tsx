import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { searchCities, getWeatherByCoordinates } from "@/api/api";
import { getWeatherIconUrl } from "@/helpers";

import { CitySearchResult, RecentSearch, WeatherPreview, WeatherResponse } from "@/types";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [weatherPreview, setWeatherPreview] = useState<WeatherPreview | null>(
    null
  );
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Morocco coordinates
  const initialRegion: Region = {
    latitude: 31.7917,
    longitude: -7.0926,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };  

  // Search handler with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: CitySearchResult) => {
    try {
      setLoading(true);
      setSelectedLocation({
        latitude: city.lat,
        longitude: city.lon,
      });

      // Fetch weather data for preview
      const weatherData = await getWeatherByCoordinates(city.lat, city.lon);
      setWeatherPreview({
        name: city.name,
        country: city.country,
        temp: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        lat: city.lat,
        lon: city.lon,
      });
      setShowPreview(true);

      // Add to recent searches if not already there
      if (!recentSearches.some((item) => item.name === city.name)) {
        const temp = `${Math.round(weatherData.main.temp)}°`;
        setRecentSearches((prev) => [
          {
            name: city.name,
            temp,
            lat: city.lat,
            lon: city.lon,
            country: city.country,
          },
          ...prev.slice(0, 4),
        ]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToForecast = async () => {
    if (!weatherPreview) return;

    try {
      setLoading(true);
      const weatherData = await getWeatherByCoordinates(
        weatherPreview.lat,
        weatherPreview.lon
      );
      router.push({
        pathname: "/(screens)/forecast",
        params: {
          city: JSON.stringify(weatherData),
        },
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeRecentSearch = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Map View */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        region={
          selectedLocation
            ? {
                ...selectedLocation,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }
            : initialRegion
        }
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation}>
            <View>
              <MaterialIcons name="location-on" size={30} color="#f44336" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Weather Preview Panel */}
      {showPreview && weatherPreview && (
        <View style={styles.weatherPreview}>
          <View style={styles.weatherPreviewContent}>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherCity}>
                {weatherPreview.name}, {weatherPreview.country}
              </Text>
              <Text style={styles.weatherTemp}>{weatherPreview.temp}°</Text>
              <Text style={styles.weatherDesc}>
                {weatherPreview.description}
              </Text>
            </View>
            <Image
              source={{ uri: getWeatherIconUrl(weatherPreview.icon) }}
              style={styles.weatherIcon}
            />
          </View>
          <TouchableOpacity
            style={styles.forecastButton}
            onPress={navigateToForecast}
          >
            <Text style={styles.forecastButtonText}>View Forecast</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closePreviewButton}
            onPress={() => setShowPreview(false)}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Search and Recent Searches Panel */}
      <View style={styles.searchContainer}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={22}
                color="#666"
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Search here"
              style={styles.searchInput}
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="mic" size={22} color="#666" />
            )}
          </View>
        </View>

        {/* Search Results or Recent Searches */}
        <View style={styles.recentSearchContainer}>
          {searchQuery.length > 2 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentSearchItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <View style={styles.recentSearchLeft}>
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color="#666"
                      style={styles.clockIcon}
                    />
                    <Text style={styles.cityName}>
                      {item.name}, {item.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !loading && searchQuery.length > 2 ? (
                  <Text style={styles.noResultsText}>No cities found</Text>
                ) : null
              }
            />
          ) : (
            <>
              {recentSearches.length > 0 && (
                <>
                  <Text style={styles.recentSearchTitle}>Recent search</Text>
                  <View style={styles.recentSearchList}>
                    {recentSearches.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recentSearchItem}
                        onPress={() =>
                          handleCitySelect({
                            name: item.name,
                            country: item.country,
                            lat: item.lat,
                            lon: item.lon,
                          })
                        }
                      >
                        <View style={styles.recentSearchLeft}>
                          <Ionicons
                            name="time-outline"
                            size={22}
                            color="#666"
                            style={styles.clockIcon}
                          />
                          <Text style={styles.cityName}>{item.name}</Text>
                        </View>
                        <View style={styles.recentSearchRight}>
                          <Text style={styles.temperature}>{item.temp}</Text>
                          <TouchableOpacity
                            onPress={() => removeRecentSearch(index)}
                          >
                            <Ionicons name="close" size={20} color="#666" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>

      {/* Compass Button */}
      <View style={styles.compassContainer}>
        <TouchableOpacity style={styles.compassButton}>
          <Ionicons name="compass" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 24,
    paddingTop: 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  recentSearchContainer: {
    paddingHorizontal: 24,
    maxHeight: height * 0.4,
  },
  recentSearchTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recentSearchList: {
    marginTop: 4,
  },
  recentSearchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentSearchLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentSearchRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    marginRight: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  temperature: {
    fontSize: 14,
    color: "#333",
    marginRight: 12,
  },
  noResultsText: {
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  compassContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  compassButton: {
    backgroundColor: "white",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  weatherPreview: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherPreviewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherCity: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  weatherDesc: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  forecastButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  forecastButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  closePreviewButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});

// Custom map style to match the light beige/yellow land and light blue water
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5dc", // Light beige for land
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#87CEEB", // Light blue for water
      },
    ],
  },
];
