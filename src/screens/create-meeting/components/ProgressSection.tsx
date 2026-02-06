import { View, Text, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";
import { useMemo } from "react";

type Props = {
  originDone: boolean;
  destDone: boolean;
  dateDone: boolean;
  timeDone: boolean;
  titleDone: boolean;
  routeDone: boolean;

  doneCount: number;
  progressText: string;
  showTips: boolean;
};

export function ProgressSection(props: Props) {

  const bearSetting = require("../../../../assets/bears/bear_setting.png");
  const bearHappy = require("../../../../assets/bears/bear_good.png");

  const tipText = useMemo(() => {
    if (!props.destDone) {
      return "출발/도착이 가까우면 경로가 안 뜰 수 있어요. 그럴 땐 도보 이동을 고려해보세요.";
    }

    if (!props.dateDone) {
      return "날짜를 먼저 선택해 주세요. 날짜가 있어야 출발 시간을 정확히 계산할 수 있어요.";
    }

    if (!props.timeDone) {
      return "심야 시간에는 대중교통 운행이 제한될 수 있어요. 택시나 자가용 이동을 추천해요.";
    }

    if (!props.titleDone) {
      return "약속 제목을 적어두면 나중에 목록에서 찾기 쉬워요.";
    }

    if (!props.routeDone) {
      return "이동 시간은 최근 교통 데이터를 기반으로 한 평균값이에요.\n실제 상황에 따라 조금 달라질 수 있어요.";
    }

    return "약속 저장 후 출발 10분 전부터 사진을 찍어 출발 인증이 가능해요.";

  }, [props.destDone, props.dateDone, props.timeDone, props.titleDone, props.routeDone]);


  return (
    <View style={styles.infoCard}>
      <View style={styles.routeHeader}>
        <Text style={styles.infoTitle}>진행 상태</Text>
        {props.doneCount <= 5 ? (
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

        <View style={[styles.dot, props.titleDone && styles.dotOn]} />
        <Text style={styles.progressText}>제목</Text>

        <View style={[styles.dot, props.routeDone && styles.dotOn]} />
        <Text style={styles.progressText}>경로</Text>
      </View>

      <View style={styles.bearGuideWrap}>
        {props.doneCount <= 5 ? <Image source={bearSetting} style={styles.bearGuideImg} resizeMode="contain" /> : <Image source={bearHappy} style={styles.bearGuideImg} resizeMode="contain" />}
        <View style={styles.bearBubble}>
          <Text style={styles.bearBubbleText}>
            {props.progressText}
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡Tip</Text>
          <Text style={styles.tipText}>
            {tipText}
          </Text>
        </View>
      </View>
    </View>
  );
}
