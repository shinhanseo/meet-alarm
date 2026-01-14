import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

type Props = {
  originPlace: any;
  destPlace: any;
  meetingTime: Date | null;
  meetingDayOffset: number;
  selectedRoute: any;

  onPressCreate: () => void;
  onPressEdit: () => void;
  onPressSearchRoute: () => void;
};

export default function MeetingSection({
  originPlace,
  destPlace,
  meetingTime,
  meetingDayOffset,
  selectedRoute,
  onPressCreate,
  onPressEdit,
  onPressSearchRoute,
}: Props) {
  const hasMeeting = !!(originPlace && destPlace && meetingTime);

  return !hasMeeting ? (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>아직 약속이 없어요</Text>
      <Text style={styles.emptySub}>
        출발지·도착지·시간을 설정하면 출발 추천 시간과 타이머가 보여요.
      </Text>

      <Pressable onPress={onPressCreate} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>약속 설정하러 가기</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.meetingCard}>
      <Text style={styles.sectionLabel}>다음 약속</Text>

      <View style={styles.placeRow}>
        <Text style={styles.placeText} numberOfLines={1}>
          {originPlace?.name ?? ""}
        </Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.placeText} numberOfLines={1}>
          {destPlace?.name ?? ""}
        </Text>
      </View>

      <Text style={styles.meetingMeta}>
        {meetingDayOffset === 0 ? "오늘" : "내일"} ·{" "}
        {meetingTime?.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Text>

      <View style={styles.meetingActions}>
        <Pressable onPress={onPressEdit} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>약속 수정</Text>
        </Pressable>

        <Pressable onPress={onPressSearchRoute} style={styles.primaryBtnSmall}>
          <Text style={styles.primaryBtnSmallText}>
            {selectedRoute ? "경로 다시 탐색" : "경로 탐색"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
