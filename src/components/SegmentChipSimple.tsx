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

export function SegmentChipSimple({ seg }: { seg: Segment }) {
  const isWalk = seg.type === "WALK";
  
  const icon = seg.type === "WALK" ? "🚶" : seg.type === "BUS" ? "🚌" : "🚇";
  const label = seg.type === "WALK" 
    ? seg.timeText
    : seg.route || seg.line || "";

  const bgColor = isWalk ? "#F3F4F6" : seg.color ? `#${seg.color}` : "#3B82F6";
  const textColor = isWalk ? "#4B5563" : "#FFFFFF";

  return (
    <View style={styles.container}>
      <View style={[styles.chip, { backgroundColor: bgColor }]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.chipText, { color: textColor }]}>
          {label}
        </Text>
        {!isWalk && (
          <Text style={[styles.timeText, { color: textColor }]}>
            {seg.timeText}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  icon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.9,
  },
});