import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";
import { SegmentChip } from "@/src/components/SegmentChip";
import { RouteBar } from "@/src/components/RouteBar";

type Props = {
  selectedRoute: any;
  onPressChangeRoute: () => void;
  isConfirmed: boolean;
};

export default function HomeRouteSection({ selectedRoute, onPressChangeRoute, isConfirmed }: Props) {
  return !isConfirmed ? (
    <View style={styles.emptyCard}>
      <Text style={styles.emptySub}>
        경로 선택 시 자세한 경로가 보여요.
      </Text>
    </View>
  ) : (
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
        <RouteBar
          segments={selectedRoute.segments ?? []}
          routeOnly
        />

        {selectedRoute.segments?.map((seg: any, i: number) => (
          <SegmentChip key={`seg-${i}`} seg={seg} />
        ))}
      </View>
    </View>
  );
}
