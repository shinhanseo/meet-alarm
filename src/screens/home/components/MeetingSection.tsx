import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

type Props = {
  originPlace: any;
  destPlace: any;

  meetingDate: string | null;
  meetingTime: string | null;

  selectedRoute: any;
  isConfirmed: boolean;
  meetingTitle: string;

  onPressCreate: () => void;
  onPressEdit: () => void;
  onPressSearchRoute: () => void;
};

function relativeDayLabel(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const target = new Date(y, m - 1, d, 0, 0, 0, 0);

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";

  const day = target.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}.${mm}.${dd} (${day})`;
}

export default function MeetingSection({
  originPlace,
  destPlace,
  meetingDate,
  meetingTime,
  selectedRoute,
  isConfirmed,
  meetingTitle,
  onPressCreate,
  onPressEdit,
  onPressSearchRoute,
}: Props) {
  const hasMeetingData = !!(originPlace && destPlace && meetingDate && meetingTime);
  const showCard = isConfirmed && hasMeetingData;

  const title = (meetingTitle ?? "").trim();
  const displayTitle = title.length > 0 ? title : `${destPlace?.name ?? "약속"}`;

  return !showCard ? (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>아직 약속이 없어요</Text>
      <Text style={styles.emptySub}>
        약속 탭에서 출발지·도착지·날짜·시간을 설정해보세요!
      </Text>

      <Pressable onPress={onPressCreate} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>약속 설정하러 가기</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.meetingCard}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>이번 약속</Text>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillText} numberOfLines={1} ellipsizeMode="tail">
            {displayTitle}
          </Text>
        </View>
      </View>

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
        {meetingDate ? relativeDayLabel(meetingDate) : ""} · {meetingTime ?? ""}
      </Text>

      {/* <View style={styles.meetingActions}>
        <Pressable onPress={onPressEdit} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>약속 수정</Text>
        </Pressable>

        <Pressable onPress={onPressSearchRoute} style={styles.primaryBtnSmall}>
          <Text style={styles.primaryBtnSmallText}>
            {selectedRoute ? "경로 다시 탐색" : "경로 탐색"}
          </Text>
        </Pressable>
      </View> */}
    </View>
  );
}
