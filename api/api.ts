import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const weatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
  params: {
    //   appid: process.env.EXPO_PUBLIC_WEATHER_API_KEY,
    appid: "40258c3c3bcd20de4261d2b5154a8b55",
    units: "metric",
  },
});

// Request Interceptor
weatherApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add request transformations here if needed
    console.log(`Requesting: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
weatherApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can transform response data here
    return response.data;
  },
  (error: AxiosError) => {
    const errorMessages: Record<number, string> = {
      400: "Invalid request. Please check your city name.",
      401: "Unauthorized. Please check your API key.",
      404: "City not found. Please try another location.",
      429: "Too many requests. Please wait before trying again.",
      500: "Server error. Please try again later.",
    };

    let errorMessage = "Failed to fetch weather data";

    if (error.response) {
      errorMessage =
        errorMessages[error.response.status] ||
        error.response.data?.message ||
        "Unknown server error";
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Please check your connection.";
    } else if (error.message === "Network Error") {
      errorMessage = "Network error. Please check your internet connection.";
    }

    console.error("API Error:", errorMessage, error);
    return Promise.reject(new Error(errorMessage));
  }
);

export const fetchCurrentWeather = async (
  city: string = "Surabaya"
): Promise<WeatherResponse> => {
  try {
    return await weatherApi.get("/weather", {
      params: { q: city },
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

export const fetchForecast = async (
  city: string = "Surabaya"
): Promise<ForecastResponse> => {
  try {
    return await weatherApi.get("/forecast", {
      params: { q: city },
    });
  } catch (error) {
    console.error("Forecast API Error:", error);
    throw error;
  }
};
