import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";

type Props = {
  originDone: boolean;
  destDone: boolean;
  dateDone: boolean;
  timeDone: boolean;
  routeDone: boolean;

  doneCount: number;
  progressText: string;
  showTips: boolean;
};

export function ProgressSection(props: Props) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.routeHeader}>
        <Text style={styles.infoTitle}>진행 상태</Text>
        {props.doneCount <= 4 ? (
          <MaterialIcons name="autorenew" size={18} color={THEME.orange} />
        ) : (
          <MaterialIcons name="check-circle" size={18} color={THEME.orange} />
        )}
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.dot, props.originDone && styles.dotOn]} />
        <Text style={styles.progressText}>출발지</Text>

        <View style={[styles.dot, props.destDone && styles.dotOn]} />
        <Text style={styles.progressText}>도착지</Text>

        <View style={[styles.dot, props.dateDone && styles.dotOn]} />
        <Text style={styles.progressText}>날짜</Text>

        <View style={[styles.dot, props.timeDone && styles.dotOn]} />
        <Text style={styles.progressText}>시간</Text>

        <View style={[styles.dot, props.routeDone && styles.dotOn]} />
        <Text style={styles.progressText}>경로</Text>
      </View>

      <Text style={styles.infoDesc}>{props.progressText}</Text>

      {props.showTips && (
        <View>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>팁</Text>
            <Text style={styles.tipText}>
              출발/도착이 가까우면 경로가 안 뜰 수 있어요. 그럴 땐 도보 이동을 고려해보세요.
            </Text>
          </View>

          <View style={[styles.tipBox, { marginTop: 10 }]}>
            <Text style={styles.tipTitle}>팁</Text>
            <Text style={styles.tipText}>
              심야 시간에는 대중교통 운행이 제한될 수 있어요. 택시나 자가용 이동을 추천해요.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
