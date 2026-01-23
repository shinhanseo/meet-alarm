import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";
import { RouteBar } from "@/src/components/RouteBar";

type Props = {
  selectedRoute: any | null;
  readyInput: boolean;
  routeSummaryText: string;

  onPressSearch: () => void;
  onPressClear: () => void;
};

export function CreateMeetingRouteSection(props: Props) {
  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <Text style={styles.routeTitle}>경로 선택</Text>
        <MaterialIcons name="directions" size={20} color={THEME.orange} />
      </View>

      {!props.selectedRoute ? (
        <Pressable
          onPress={props.onPressSearch}
          disabled={!props.readyInput}
          style={[styles.routeBtn, !props.readyInput && { opacity: 0.55 }]}
        >
          <Text style={styles.routeBtnText}>
            {props.readyInput ? "경로 탐색하기" : "필수 입력을 먼저 설정해주세요"}
          </Text>
        </Pressable>
      ) : (
        <>
          <Text style={styles.routeSummaryText}>{props.routeSummaryText}</Text>

          <View style={{ marginTop: 10 }}>
            <RouteBar segments={props.selectedRoute.segments ?? []} />
          </View>

          <View style={styles.routeActions}>
            <Pressable onPress={props.onPressSearch} style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>경로 변경</Text>
            </Pressable>

            <Pressable
              onPress={props.onPressClear}
              style={[styles.smallBtn, styles.smallBtnDanger]}
            >
              <Text style={[styles.smallBtnText, styles.smallBtnDangerText]}>
                경로 지우기
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
