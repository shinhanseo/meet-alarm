import { View, Text } from "react-native";
import { styles } from "../styles";
import { THEME } from "../theme";

type Props = {
  readyToShowResult: boolean;
  meetingDayOffset: number;
  departTimeText: string;
  seconds: number;
  timerText: string;
};

export default function TimerSection({
  readyToShowResult,
  meetingDayOffset,
  departTimeText,
  seconds,
  timerText,
}: Props) {
  return (
    <View style={styles.timerCard}>
      <Text style={styles.sectionLabel}>출발 추천</Text>

      {readyToShowResult ? (
        <>
          <View style={styles.departRow}>
            <Text style={styles.departTime}>
              {meetingDayOffset === 0 ? "오늘 " : "내일 "}
              {departTimeText}
            </Text>

            <View
              style={[
                styles.badge,
                seconds <= 300 && { backgroundColor: THEME.dangerSoft, borderColor: "#FECACA" },
              ]}
            >
              <Text style={[styles.badgeText, seconds <= 300 && styles.badgeDanger]}>
                {seconds <= 300 ? "5분 이내" : "여유 있음"}
              </Text>
            </View>
          </View>

          <View style={styles.countdownBox}>
            <Text style={[styles.countdownText, seconds <= 300 && styles.countdownDanger]}>
              {timerText}
            </Text>
            <Text style={styles.countdownSub}>출발까지 남은 시간</Text>
          </View>
        </>
      ) : (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>경로를 선택하면 출발 추천 시간과 타이머가 보여요.</Text>
        </View>
      )}
    </View>
  );
}
