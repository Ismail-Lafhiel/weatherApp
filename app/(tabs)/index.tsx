import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { fetchCurrentWeather } from "@/api/api";
import { getWeatherIconUrl } from "@/helpers";
import { format } from "date-fns";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchCurrentWeather();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWeatherData();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <LinearGradient
        colors={["#56CCF2", "#2F80ED"]}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#56CCF2", "#2F80ED"]}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-white text-lg">{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={["#56CCF2", "#2F80ED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 relative">
          {/* White Dotted Background Pattern */}
          <View className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                className="flex-row justify-between"
              >
                {Array.from({ length: 10 }).map((_, colIndex) => (
                  <View
                    key={`dot-${rowIndex}-${colIndex}`}
                    className="w-1.5 h-1.5 rounded-full bg-white opacity-15 m-6"
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Location Header */}
          <View className="flex-row justify-between items-center px-6 pt-16">
            <View className="flex-row items-center">
              <Ionicons name="location" size={25} color="white" />
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-2xl ml-2"
              >
                {weatherData?.name || "Loading..."}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="white"
                className="ml-2"
              />
            </View>
            <View className="bg-white/10 rounded-full p-2">
              <Ionicons name="notifications" size={24} color="white" />
            </View>
          </View>

          {/* Weather Icon */}
          <View className="items-center justify-center my-12">
            {weatherData?.weather[0]?.icon && (
              <Image
                source={{
                  uri: getWeatherIconUrl(weatherData.weather[0].icon, "4x"),
                }}
                className="w-32 h-32"
                resizeMode="contain"
              />
            )}
          </View>

          {/* Weather Card */}
          <View
            className="mx-6 bg-white/20 backdrop-blur-sm rounded-[28px] p-6 shadow-lg"
            style={{
              shadowColor: "rgba(0,0,0,0.1)",
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
            }}
          >
            {/* Date */}
            <View className="items-center mb-2">
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-white text-base"
              >
                {weatherData?.dt
                  ? format(new Date(weatherData.dt * 1000), "EEEE, d MMMM")
                  : "Loading..."}
              </Text>
            </View>

            {/* Temperature */}
            <View className="items-center mb-4">
              <Text
                style={{
                  fontFamily: "Poppins_300Light",
                  textShadowColor: "rgba(255,255,255,0.4)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 8,
                }}
                className="text-white text-8xl tracking-tight pt-8 font-semibold"
              >
                {weatherData?.main?.temp
                  ? `${Math.round(weatherData.main.temp)}°`
                  : "--°"}
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-white text-xl mt-1"
              >
                {weatherData?.weather[0]?.main || "Loading"}
              </Text>
            </View>

            {/* Weather Details */}
            <View className="mt-4">
              {/* Wind */}
              <View className="flex-row items-center justify-center">
                <Ionicons name="navigate-outline" size={16} color="white" />
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-white text-md ml-2 w-12 font-semibold"
                >
                  Wind
                </Text>
                <Text className="text-white text-md mx-4 opacity-60">|</Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-white text-md font-semibold"
                >
                  {weatherData?.wind?.speed
                    ? `${Math.round(weatherData.wind.speed * 3.6)} km/h`
                    : "-- km/h"}
                </Text>
              </View>

              {/* Humidity */}
              <View className="flex-row items-center justify-center mt-3">
                <Ionicons name="water-outline" size={16} color="white" />
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-white text-md ml-2 w-12 font-semibold"
                >
                  Hum
                </Text>
                <Text className="text-white text-md mx-4 opacity-60">|</Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-white text-md font-semibold"
                >
                  {weatherData?.main?.humidity
                    ? `${weatherData.main.humidity}%`
                    : "--%"}
                </Text>
              </View>
            </View>
          </View>

          {/* Forecast Button */}
          <View
            className="items-center mt-28"
            style={{ marginBottom: 80 + insets.bottom }}
          >
            <TouchableOpacity
              onPress={() => router.navigate("/(screens)/forecast")}
              className="bg-white py-5 rounded-[20px] flex-row items-center justify-center"
              style={{
                elevation: 4,
                shadowColor: "rgba(0,0,0,0.2)",
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                shadowOpacity: 0.2,
                width: 220,
              }}
            >
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-700 text-xl"
              >
                Forecast report
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666"
                className="ml-4"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
