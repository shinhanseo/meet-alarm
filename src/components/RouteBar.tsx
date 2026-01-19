import { View, Text, StyleSheet } from "react-native";

export type Segment = {
  type: "WALK" | "BUS" | "SUBWAY" | string;
  timeText: string;
  distanceM: number;
  from?: string;
  to?: string;
  route?: string;
  line?: string;
  color?: string; // 예: "3B82F6" (샵 없이 오는 값)
};

function SegmentBar({
  seg,
  totalMinutes,
}: {
  seg: Segment;
  totalMinutes: number;
}) {
  const mins = parseInt(seg.timeText.replace(/[^0-9]/g, "")) || 0;

  const ratio = totalMinutes > 0 ? mins / totalMinutes : 0;

  const minFlex = 0.18;
  const flexValue = totalMinutes > 0 ? Math.max(ratio, minFlex) : minFlex;

  const isWalk = seg.type === "WALK";
  const bgColor = isWalk
    ? "#E2E2E2"
    : seg.color
    ? (seg.color.startsWith("#") ? seg.color : `#${seg.color}`)
    : "#3B82F6";

  return (
      <View style={[styles.barSegment, { flex: flexValue, backgroundColor: bgColor }]}>
        <Text style={styles.barText} numberOfLines={1}>
          {isWalk ? `🚶${mins}분` : `${mins}분`}
        </Text>
      </View>
  );
}

function SegmentLabel({ seg }: { seg: Segment }) {
  const mainLabel =
    seg.type === "BUS"
      ? `🚌 ${seg.route ?? "버스"}`
      : seg.type === "SUBWAY"
      ? `🚇 ${seg.line ?? "지하철"}`
      : "";

  if (!mainLabel) return null;

  const backgroundColor = seg.type == "WALK"
    ? "#FFFFFF"                    // 도보: 화이트
    : seg.color
    ? `#${seg.color}`              // 버스/지하철: 원래 색 유지
    : "#E5E7EB";

  return (
    <View style={[styles.labelChip, { backgroundColor }]}>
      <Text style={styles.labelText} numberOfLines={1}>
        {mainLabel}
      </Text>
    </View>
  );
}

export function RouteBar({
  segments,
  routeOnly = false,
}: {
  segments: Segment[];
  routeOnly?: boolean;
}) {
  const totalMinutes = segments.reduce((sum, seg) => {
    const mins = parseInt(seg.timeText.replace(/[^0-9]/g, "")) || 0;
    return sum + mins;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {segments.map((seg, idx) => (
          <SegmentBar key={`bar-${idx}`} seg={seg} totalMinutes={totalMinutes} />
        ))}
      </View>

      {!routeOnly && (
        <View style={styles.labelsRow}>
          {segments.map((seg, idx) => (
            <SegmentLabel key={`label-${idx}`} seg={seg} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },

  barContainer: {
    flexDirection: "row",
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    marginBottom : 8,
  },
  barSegment: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  barText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  labelsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  labelChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
});
