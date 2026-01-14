import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";
import { SegmentChip } from "@/src/components/SegmentChip";

type Props = {
  selectedRoute: any;
  onPressChangeRoute: () => void;
};

export default function RouteSection({ selectedRoute, onPressChangeRoute }: Props) {
  if (!selectedRoute) return null;

  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <Text style={styles.routeTitle}>선택한 경로</Text>
        <Pressable onPress={onPressChangeRoute} style={styles.routeLinkBtn}>
          <Text style={styles.routeLinkText}>경로 변경</Text>
        </Pressable>
      </View>

      <Text style={styles.routeMeta}>
        {selectedRoute.summary.totalTimeText} · 환승 {selectedRoute.summary.transferCount}회 · 도보{" "}
        {selectedRoute.summary.totalWalkTimeText}
      </Text>

      <View style={{ marginTop: 12, gap: 10 }}>
        {selectedRoute.segments?.map((seg: any, i: number) => (
          <SegmentChip key={`seg-${i}`} seg={seg} />
        ))}
      </View>
    </View>
  );
}
