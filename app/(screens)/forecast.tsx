import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { fetchForecast } from "@/api/api";
import { getWeatherIconUrl } from "@/helpers";
import { format, fromUnixTime } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const loadForecastData = async () => {
      try {
        const data = await fetchForecast();
        setForecastData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadForecastData();
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

  // Process hourly forecast (next 5 hours)
  const hourlyForecast = forecastData?.list.slice(0, 5).map((item: any) => ({
    time: format(fromUnixTime(item.dt), "HH:mm"),
    temp: `${Math.round(item.main.temp)}°`,
    icon: item.weather[0].icon,
  }));

  const dailyForecast = forecastData?.list
    .filter((item: any, index: number) => index % 8 === 0)
    .slice(0, 7)
    .map((item: any) => ({
      date: format(fromUnixTime(item.dt), "EEE, MMM d"),
      dayOfWeek: format(fromUnixTime(item.dt), "EEE"),
      temp: `${Math.round(item.main.temp)}°`,
      icon: item.weather[0].icon,
      condition: item.weather[0].main,
      minTemp: Math.round(item.main.temp_min),
      maxTemp: Math.round(item.main.temp_max),
    }));

  return (
    <LinearGradient
      colors={["#56CCF2", "#2F80ED"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1" style={{ paddingTop: insets.top }}>
        {/* White Dotted Background Pattern */}
        <View className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, rowIndex) => (
            <View key={`row-${rowIndex}`} className="flex-row justify-between">
              {Array.from({ length: 10 }).map((_, colIndex) => (
                <View
                  key={`dot-${rowIndex}-${colIndex}`}
                  className="w-1.5 h-1.5 rounded-full bg-white opacity-15 m-6"
                />
              ))}
            </View>
          ))}
        </View>

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="chevron-back" size={25} color="white" />
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-white text-xl ml-1"
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-4">
          {/* Today's Forecast */}
          <View className="mt-12">
            <View className="flex-row justify-between items-center mb-10">
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="px-4 text-white text-2xl"
              >
                Today
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-white text-md"
              >
                {format(new Date(), "MMM. d")}
              </Text>
            </View>

            {/* Hourly Forecast */}
            <View className="flex-row justify-between mt-4 mb-6">
              {hourlyForecast?.map((item: any, index: number) => (
                <View
                  key={index}
                  className={`items-center justify-between py-4 px-1 rounded-[20px] ${
                    index === 2 ? "bg-white/20" : ""
                  }`}
                  style={{ width: 70 }}
                >
                  <Text
                    style={{ fontFamily: "Poppins_500Medium" }}
                    className="text-white text-md mb-4"
                  >
                    {item.temp}
                  </Text>
                  <Image
                    source={{
                      uri: getWeatherIconUrl(item.icon),
                    }}
                    className="w-20 h-16"
                    resizeMode="contain"
                  />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-white text-md mt-6"
                  >
                    {item.time}
                  </Text>
                </View>
              ))}
            </View>

            {/* Next Forecast */}
            <View className="px-4 my-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-2xl"
                >
                  Next Forecast
                </Text>
                <Ionicons name="calendar-outline" size={22} color="white" />
              </View>

              {/* Daily Forecast */}
              <View className="relative h-[350px]">
                {" "}
                <View className="absolute right-1 top-0 bottom-0 w-1.5 bg-white/30 rounded-full" />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {dailyForecast?.map((item: any, index: number) => (
                    <View
                      key={index}
                      className="flex-row items-center py-3 justify-between"
                      style={{
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Poppins_400Regular" }}
                        className="text-white text-lg"
                      >
                        {item.date}
                      </Text>
                      <Image
                        source={{
                          uri: getWeatherIconUrl(item.icon),
                        }}
                        className="w-16 h-16"
                        resizeMode="contain"
                      />
                      <Text
                        style={{ fontFamily: "Poppins_500Medium" }}
                        className="text-white text-lg min-w-[60px] text-right mr-12"
                      >
                        {item.temp}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Attribution */}
            <View className="items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="sunny"
                  size={22}
                  color="white"
                  className="mr-4"
                />
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-white text-lg"
                >
                  OpenWeather
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
