import { View, Text, Pressable } from "react-native";
import { Route } from "@/src/types";
import { styles } from "../styles";
import { SegmentChip } from "@/src/components/SegmentChip";
import { RouteBar } from "@/src/components/RouteBar";

type Props = {
  selectedRoute: Route | null;
  isConfirmed: boolean;
};

export default function HomeRouteSection({ selectedRoute, isConfirmed }: Props) {
  return !isConfirmed ? (
    <View style={styles.emptyCard}>
      <Text style={styles.emptySub}>
        경로 선택 시 자세한 경로가 보여요.
      </Text>
    </View>
  ) : (
    <View style={styles.routeCard}>

      <View style={styles.routeHeader}>
        <Text style={[styles.routeTitle, { marginBottom: 8, }]}>선택한 경로</Text>
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

        {selectedRoute.segments?.map((seg, i) => (
          <SegmentChip key={`seg-${i}`} seg={seg} />
        ))}
      </View>
    </View>
  );
}
