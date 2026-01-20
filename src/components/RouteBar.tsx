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

function parseKoreanTime(text: string) {
  let total = 0;

  const hourMatch = text.match(/(\d+)\s*시간/);
  const minMatch = text.match(/(\d+)\s*분/);

  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);

  return total;
}

function SegmentBar({
  seg,
  totalMinutes,
}: {
  seg: Segment;
  totalMinutes: number;
}) {
  const mins = parseKoreanTime(seg.timeText);
  if (mins == 0) return;

  const ratio = totalMinutes > 0 ? mins / totalMinutes : 0;

  const minFlex = 0.08;
  const flexValue = totalMinutes > 0 ? Math.max(ratio, minFlex) : minFlex;

  const isWalk = seg.type === "WALK";
  const bgColor = isWalk
    ? "#E2E2E2"
    : seg.color
      ? (seg.color.startsWith("#") ? seg.color : `#${seg.color}`)
      : "#3B82F6";

  const textColor = isWalk ? "#111827" : "#FFFFFF";

  return (
    <View style={[styles.barSegment, { flex: flexValue, backgroundColor: bgColor }]}>
      <Text style={[styles.barText, { color: textColor }]} numberOfLines={1}>
        {seg.timeText}
      </Text>
    </View>
  );
}

function formatBusRoute(route?: string) {
  if (!route) return "버스";

  // 숫자만 추출 (버스 번호)
  const number = route.match(/\d+/)?.[0] ?? "";

  if (route.includes("직행") || route.includes("광역")) {
    return `광역버스 ${number}`;
  }

  if (route.includes("마을")) {
    return `마을버스 ${number}`;
  }

  if (route.includes("일반")) {
    return `시내버스 ${number}`;
  }

  return `버스 ${number}`;
}

function SegmentLabel({ seg }: { seg: Segment }) {
  const mainLabel =
    seg.type === "BUS"
      ? `🚌 ${formatBusRoute(seg.route) ?? "버스"}`
      : seg.type === "SUBWAY"
        ? `🚇 ${seg.line ?? "지하철"}`
        : seg.type === "AIRPLANE"
          ? `✈️ 비행기`
          : seg.type === "EXPRESSBUS"
            ? `🚎 고속/시외 버스`
            : "";

  if (!mainLabel) return null;

  const backgroundColor = seg.type === "WALK"
    ? "#E2E2E2"                    // 도보: 화이트
    : seg.color
      ? `#${seg.color}`              // 버스/지하철: 원래 색 유지
      : "#3B82F6";

  const textColor = seg.type == "WALK" ? "#111827" : "#FFFFFF";

  return (
    <View style={[styles.labelChip, { backgroundColor }]}>
      <Text style={[styles.labelText, { color: textColor }]} numberOfLines={1}>
        {mainLabel}
      </Text>
    </View>
  );
}

function WalkLabel() {
  return (
    <View style={[styles.labelChip, { backgroundColor: "#E2E2E2" }]}>
      <Text style={[styles.labelText, { color: "#111827" }]} numberOfLines={1}>
        🚶 도보
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

  const hasWalk = segments.some((seg) => seg.type === "WALK");

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

          {hasWalk && <WalkLabel />}
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
    marginBottom: 8,
  },
  barSegment: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: 13,
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
  },
});
