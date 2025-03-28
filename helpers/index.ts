export const getWeatherIconUrl = (
  iconCode: string,
  size: "2x" | "4x" = "2x"
) => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};
