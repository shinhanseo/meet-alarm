import { View, Text, ActivityIndicator, Image } from "react-native";
import { styles } from "../styles";
import { THEME } from "../theme";

type WeatherDto = {
  name: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  main: string;
  description: string;
  icon: string;
  dt: number;
};

type Props = {
  destPlaceName?: string | null;
  loading: boolean;
  error: string | null;
  weather: WeatherDto | null;
};

export default function WeatherSection({
  destPlaceName,
  loading,
  error,
  weather,
}: Props) {
  const hasDest = !!destPlaceName;

  const isBadWeather =
    weather?.main === "Rain" ||
    weather?.main === "Snow" ||
    weather?.main === "Thunderstorm";

  return (
    <>
      <View style={styles.routeCard}>
        {!hasDest && (
          <Text style={styles.routeMeta}>목적지를 설정하면 날씨를 보여요.</Text>
        )}

        {hasDest && loading && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator />
            <Text style={styles.routeMeta}>불러오는 중...</Text>
          </View>
        )}

        {hasDest && !loading && error && (
          <Text style={styles.routeMeta}>{error}</Text>
        )}

        {hasDest && !loading && !error && weather && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.routeTitle}>
                {destPlaceName} · {weather.description}
              </Text>

              <Text style={[styles.departTime, { marginTop: 8 }]}>
                {Math.round(weather.temp)}°C{" "}
                <Text style={{ fontSize: 12, fontWeight: "800", color: THEME.muted }}>
                  체감 {Math.round(weather.feelsLike)}°C
                </Text>
              </Text>

              <Text style={styles.routeMeta}>
                습도 {weather.humidity}% · 바람 {weather.windSpeed}m/s
              </Text>

              {isBadWeather && (
                <View style={[styles.badge, { marginTop: 10, alignSelf: "flex-start" }]}>
                  <Text style={[styles.badgeText, styles.badgeDanger]}>우산 챙기기 추천</Text>
                </View>
              )}
            </View>

            {!!weather.icon && (
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                style={{ width: 56, height: 56 }}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
}
