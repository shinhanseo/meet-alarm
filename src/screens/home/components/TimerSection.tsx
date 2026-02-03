import { View, Text, Image as RNImage } from "react-native";
import { styles } from "../styles";
import { THEME } from "../../../styles/theme";

type Props = {
  readyToShowResult: boolean;
  departureAtISO: string | null;
  departTimeText: string;
  seconds: number;
  timerText: string;
  isConfirmed: boolean;
};

// "오늘/내일/날짜" 라벨 만들기 (출발 시각 기준)
function departDayLabel(departureAtISO: string) {
  const depart = new Date(departureAtISO);
  if (Number.isNaN(depart.getTime())) return "";

  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const depart0 = new Date(depart.getFullYear(), depart.getMonth(), depart.getDate(), 0, 0, 0, 0);

  const diffDays = Math.round((depart0.getTime() - today0.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";

  // 그 외는 날짜로 표시
  const day = depart.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const y = depart.getFullYear();
  const m = String(depart.getMonth() + 1).padStart(2, "0");
  const d = String(depart.getDate()).padStart(2, "0");
  return `${y}.${m}.${d} (${day})`;
}

function bearSourceBySeconds(seconds: number) {
  if (seconds <= 0) {
    return require("../../../../assets/bears/bear_busback2.png");
  }
  if (seconds <= 120) {
    return require("../../../../assets/bears/bear_go3.png");
  }
  if (seconds <= 300) {
    return require("../../../../assets/bears/bear_hurry.png");
  }
  if (seconds <= 600) {
    return require("../../../../assets/bears/bear_bag.png");
  }
  if (seconds <= 900) {
    return require("../../../../assets/bears/bear_wearing.png");
  }
  if (seconds <= 1800) {
    return require("../../../../assets/bears/bear_shower.png");
  }
  return require("../../../../assets/bears/bear_sleep.png");
}

export default function TimerSection({
  readyToShowResult,
  departureAtISO,
  departTimeText,
  seconds,
  timerText,
  isConfirmed,
}: Props) {
  const dayPrefix =
    readyToShowResult && departureAtISO ? `${departDayLabel(departureAtISO)} ` : "";

  return (
    <View style={styles.timerCard}>
      <Text style={styles.sectionLabel}>출발 추천 시간</Text>

      {readyToShowResult && isConfirmed ? (
        <>
          <View style={styles.departRow}>
            <Text style={styles.departTime}>
              {dayPrefix}
              {departTimeText}
            </Text>

            <View
              style={[
                styles.badge,
                seconds <= 300 && {
                  backgroundColor: THEME.dangerSoft,
                  borderColor: "#FECACA",
                },
              ]}
            >
              <Text style={[styles.badgeText, seconds <= 300 && styles.badgeDanger]}>
                {seconds <= 0
                  ? "지금 출발하세요!"
                  : seconds <= 300
                    ? "늦지 않게 서두르세요!"
                    : seconds <= 600
                      ? "이제 소지품을 챙겨보세요!"
                      : seconds <= 900
                        ? "옷을 입어볼까요?"
                        : seconds <= 1800
                          ? "이제 씻어볼까요?"
                          : "아직은 마음 놓으셔도 되요"
                }
              </Text>
            </View>
          </View>

          <View style={styles.countdownBox}>
            <Text style={[styles.countdownText, seconds <= 300 && styles.countdownDanger]}>
              {timerText}
            </Text>
            <Text style={styles.countdownSub}>출발까지 남은 시간</Text>

            <RNImage
              source={bearSourceBySeconds(seconds)}
              style={styles.timerBear}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.ghostBtnText, { fontWeight: "600", fontSize: 12 }]}>
            도착 10분 전 기준으로 안내해요
          </Text>
        </>
      ) : (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>약속을 저장하면 출발 추천 시간과 타이머가 보여요.</Text>
        </View>
      )}
    </View>
  );
}