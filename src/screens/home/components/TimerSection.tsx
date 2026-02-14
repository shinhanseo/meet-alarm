import { View, Text, Image as RNImage, ImageSourcePropType } from "react-native";
import { useEffect, useState } from "react";
import { TIMER_STAGES } from "@/src/constants";
import { styles } from "../styles";
import { THEME } from "../../../styles/theme";

type Props = {
  readyToShowResult: boolean;
  departureAtISO: string | null;
  departTimeText: string;
  seconds: number;
  timerText: string;
  isConfirmed: boolean;
  isCameraVerified: boolean;
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

function getStage(seconds: number) {
  if (seconds <= 0) return 0;
  if (seconds <= TIMER_STAGES.URGENT) return 1;
  if (seconds <= TIMER_STAGES.VERY_URGENT) return 2;
  if (seconds <= TIMER_STAGES.PREPARE) return 3;
  if (seconds <= TIMER_STAGES.DRESS) return 4;
  if (seconds <= TIMER_STAGES.SHOWER) return 5;
  return 6;
}

export default function TimerSection({
  readyToShowResult,
  departureAtISO,
  departTimeText,
  seconds,
  timerText,
  isConfirmed,
  isCameraVerified,
}: Props) {
  const stage = getStage(seconds);

  const dayPrefix =
    readyToShowResult && departureAtISO ? `${departDayLabel(departureAtISO)} ` : "";

  const [bearSource, setBearSource] = useState<ImageSourcePropType>(
    require("../../../../assets/bears/bear_sleep.png")
  );

  useEffect(() => {
    let pool: ImageSourcePropType[] = [];

    if (stage === 0) {
      pool = isCameraVerified
        ? [
          require("../../../../assets/bears/bear_busback.png"),
          require("../../../../assets/bears/bear_bus.png"),
        ]
        : [require("../../../../assets/bears/bear_camera.png")];
    } else if (stage === 1) {
      pool = [require("../../../../assets/bears/bear_go3.png")];
    } else if (stage === 2) {
      pool = [
        require("../../../../assets/bears/bear_hurry.png"),
        require("../../../../assets/bears/bear_hurry2.png"),
      ];
    } else if (stage === 3) {
      pool = [require("../../../../assets/bears/bear_bag.png")];
    } else if (stage === 4) {
      pool = [
        require("../../../../assets/bears/bear_wearing.png"),
        require("../../../../assets/bears/bear_wearing2.png"),
      ];
    } else if (stage === 5) {
      pool = [
        require("../../../../assets/bears/bear_shower.png"),
        require("../../../../assets/bears/bear_shower2.png"),
      ];
    } else {
      pool = [
        require("../../../../assets/bears/bear_sleep.png"),
        require("../../../../assets/bears/bear_bed.png"),
      ];
    }

    setBearSource(pool[Math.floor(Math.random() * pool.length)]);
  }, [stage, isCameraVerified]);

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
                seconds <= TIMER_STAGES.VERY_URGENT && {
                  backgroundColor: THEME.dangerSoft,
                  borderColor: "#FECACA",
                },
              ]}
            >
              <Text style={[styles.badgeText, seconds <= TIMER_STAGES.VERY_URGENT && styles.badgeDanger]}>
                {seconds <= 0
                  ? "지금 출발하세요!"
                  : seconds <= TIMER_STAGES.VERY_URGENT
                    ? "늦지 않게 서두르세요!"
                    : seconds <= TIMER_STAGES.PREPARE
                      ? "이제 소지품을 챙겨보세요!"
                      : seconds <= TIMER_STAGES.DRESS
                        ? "옷을 입어볼까요?"
                        : seconds <= TIMER_STAGES.SHOWER
                          ? "이제 씻어볼까요?"
                          : "아직은 마음 놓으셔도 돼요"}
              </Text>
            </View>
          </View>

          <View style={styles.countdownBox}>
            <Text style={[styles.countdownText, seconds <= TIMER_STAGES.VERY_URGENT && styles.countdownDanger]}>
              {timerText}
            </Text>
            <Text style={styles.countdownSub}>출발까지 남은 시간</Text>

            <RNImage source={bearSource} style={styles.timerBear} resizeMode="contain" />
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
