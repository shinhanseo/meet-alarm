import { View, Text, StyleSheet } from "react-native";

type Segment = {
  type: "WALK" | "BUS" | "SUBWAY" | string;
  timeText: string;
  distanceM: number;
  from?: string;
  to?: string;
  route?: string;
  line?: string;
  color?: string;
};

const formatDistance = (m?: number) => {
  if (m == null) return "";
  if (m < 1000) return `${m}m`;
  const km = m / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)}km`;
};

export function SegmentChip({ seg }: { seg: Segment }) {
  const dist = formatDistance(seg.distanceM);
  const walkSuffix = dist ? `(${dist})` : "";

  const mainLabel =
    seg.type === "WALK"
      ? `🚶 도보 ${seg.timeText}${walkSuffix}`
      : seg.type === "BUS"
      ? `🚌 ${seg.route ?? "버스"} ${seg.timeText}`
      : seg.type === "SUBWAY"
      ? `🚇 ${seg.line ?? "지하철"} ${seg.timeText}`
      : `${seg.type} ${seg.timeText}`;

  const subLabel =
    seg.from && seg.to
      ? seg.type === "SUBWAY"
        ? `${seg.from}역 → ${seg.to}역`
        : `${seg.from} → ${seg.to}`
      : "";

  const isWalk = seg.type === "WALK";

  const backgroundColor = isWalk
    ? "#FFFFFF"                    // 도보: 화이트
    : seg.color
    ? `#${seg.color}`              // 버스/지하철: 원래 색 유지
    : "#E5E7EB";

  const borderColor = isWalk ? "#E7E5E4" : "transparent";
  const textColor = isWalk ? "#111827" : "#FFFFFF";

  return (
    <View style={{ gap: 4 }}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor,
            borderColor,
            borderWidth: isWalk ? 1 : 0,
          },
        ]}
      >
        <Text style={[styles.chipText, { color: textColor }]}>
          {mainLabel}
        </Text>
      </View>

      {!!subLabel && (
        <Text style={styles.chipSubText} numberOfLines={1}>
          {subLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "800",
  },
  chipSubText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
});


