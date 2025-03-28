export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherResponse {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastResponse {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  city: {
    name: string;
  };
}

export interface RecentSearch {
  name: string;
  temp: string;
  lat: number;
  lon: number;
  country: string;
}

export interface WeatherPreview {
  name: string;
  country: string;
  temp: number;
  description: string;
  icon: string;
  lat: number;
  lon: number;
}
