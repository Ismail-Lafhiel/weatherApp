"use client";

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Weather icon components
  const WeatherIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "partly-cloudy":
        return (
          <View className="items-center justify-center">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1146/1146869.png",
              }}
              className="w-10 h-10"
              resizeMode="contain"
              style={{ tintColor: "white" }}
            />
          </View>
        );
      case "cloudy":
        return (
          <View className="items-center justify-center">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
              }}
              className="w-10 h-10"
              resizeMode="contain"
              style={{ tintColor: "white" }}
            />
          </View>
        );
      case "sunny":
        return (
          <View className="items-center justify-center">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
              }}
              className="w-12 h-12"
              resizeMode="contain"
              style={{ tintColor: "white" }}
            />
          </View>
        );
      default:
        return (
          <View className="items-center justify-center">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
              }}
              className="w-10 h-10"
              resizeMode="contain"
              style={{ tintColor: "white" }}
            />
          </View>
        );
    }
  };

  // Today's hourly forecast data
  const hourlyForecast = [
    { time: "15:00", temp: "29°", icon: "partly-cloudy", isActive: false },
    { time: "16:00", temp: "26°", icon: "partly-cloudy", isActive: false },
    { time: "17:00", temp: "24°", icon: "cloudy", isActive: true },
    { time: "18:00", temp: "23°", icon: "cloudy", isActive: false },
    { time: "19:00", temp: "22°", icon: "cloudy", isActive: false },
  ];

  // Next days forecast data
  const dailyForecast = [
    { date: "Sep. 13", temp: "21°", icon: "partly-cloudy" },
    { date: "Sep. 14", temp: "22°", icon: "cloudy" },
    { date: "Sep. 15", temp: "34°", icon: "sunny" },
    { date: "Sep. 16", temp: "27°", icon: "cloudy" },
    { date: "Sep. 17", temp: "32°", icon: "partly-cloudy" },
  ];

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
                Sep. 12
              </Text>
            </View>

            {/* Hourly Forecast */}
            <View className="flex-row justify-between mt-4 mb-6">
              {hourlyForecast.map((item, index) => (
                <View
                  key={index}
                  className={`items-center justify-between py-4 px-1 rounded-[20px] ${
                    item.isActive ? "bg-white/20" : ""
                  }`}
                  style={{ width: 70 }}
                >
                  <Text
                    style={{ fontFamily: "Poppins_500Medium" }}
                    className="text-white text-md mb-4"
                  >
                    {item.temp}
                  </Text>
                  <WeatherIcon type={item.icon} />
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
            <View className="px-4 mb-4 mt-10">
              <View className="flex-row justify-between items-center mb-8">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-2xl"
                >
                  Next Forecast
                </Text>
                <Ionicons name="calendar-outline" size={22} color="white" />
              </View>

              {/* Daily Forecast */}
              <View className="relative">
                {/* Vertical line indicator */}
                <View className="absolute right-1 top-4 bottom-4 w-1.5 bg-white/30 rounded-full" />

                {dailyForecast.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center py-3 justify-between"
                    style={{
                      gap: 24,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-white text-lg w-20"
                    >
                      {item.date}
                    </Text>

                    <WeatherIcon type={item.icon} />

                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-white text-lg min-w-[60px] text-right mr-12"
                    >
                      {item.temp}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Attribution */}
            <View className="items-center mt-10">
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
                  AccuWeather
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
