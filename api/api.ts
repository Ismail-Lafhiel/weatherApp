import { CitySearchResult, ForecastResponse, WeatherResponse } from "@/types";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    appid: "40258c3c3bcd20de4261d2b5154a8b55",
    units: "metric",
  },
});

const geoApi = axios.create({
  baseURL: GEO_URL,
  timeout: 10000,
  params: {
    appid: "40258c3c3bcd20de4261d2b5154a8b55",
  },
});

// Request Interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  console.log(`Requesting: ${config.url}`);
  return config;
};

// Response Interceptor - Modified to prevent duplicate responses
const responseInterceptor = (response: AxiosResponse) => {
  // Return the full response instead of just response.data
  return response;
};

// Error Interceptor
const errorInterceptor = (error: AxiosError) => {
  const errorMessages: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "Unauthorized. Please check your API key.",
    404: "Location not found. Please try another search.",
    429: "Too many requests. Please wait before trying again.",
    500: "Server error. Please try again later.",
  };

  let errorMessage = "Failed to fetch data";

  if (error.response) {
    errorMessage =
      errorMessages[error.response.status] ||
      (error.response.data as any)?.message ||
      "Unknown server error";
  } else if (error.code === "ECONNABORTED") {
    errorMessage = "Request timed out. Please check your connection.";
  } else if (error.message === "Network Error") {
    errorMessage = "Network error. Please check your internet connection.";
  }

  console.error("API Error:", errorMessage, error);
  return Promise.reject(new Error(errorMessage));
};

// Apply interceptors
weatherApi.interceptors.request.use(requestInterceptor, errorInterceptor);
weatherApi.interceptors.response.use(responseInterceptor, errorInterceptor);
geoApi.interceptors.request.use(requestInterceptor, errorInterceptor);
geoApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Modified API functions to properly handle responses
export const fetchCurrentWeather = async (
  city: string = "Surabaya"
): Promise<WeatherResponse> => {
  const response = await weatherApi.get<WeatherResponse>("/weather", {
    params: { q: city },
  });
  return response.data;
};

export const fetchForecast = async (
  city: string = "Surabaya"
): Promise<ForecastResponse> => {
  const response = await weatherApi.get<ForecastResponse>("/forecast", {
    params: { q: city, cnt: 40 },
  });
  return response.data;
};

export const searchCities = async (
  query: string
): Promise<CitySearchResult[]> => {
  const response = await geoApi.get<CitySearchResult[]>("/direct", {
    params: { q: query, limit: 5 },
  });
  return response.data.map((city) => ({
    name: city.name,
    country: city.country,
    state: city.state,
    lat: city.lat,
    lon: city.lon,
  }));
};

export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  const response = await weatherApi.get<WeatherResponse>("/weather", {
    params: { lat, lon },
  });
  return response.data;
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<CitySearchResult> => {
  const response = await geoApi.get<CitySearchResult[]>("/reverse", {
    params: { lat, lon, limit: 1 },
  });
  const city = response.data[0];
  return {
    name: city.name,
    country: city.country,
    state: city.state,
    lat: city.lat,
    lon: city.lon,
  };
};