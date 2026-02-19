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
};

export function TipSection(props: Props) {

  const bearSetting = useMemo(() => {
    if (props.doneCount <= 5)
      return require("../../../../assets/bears/bear_setting.png");
    else
      return require("../../../../assets/bears/bear_good.png");
  }, [props.doneCount])

  const tipText = useMemo(() => {
    if (!props.destDone) {
      return "출발/도착이 가까우면 경로가 안 뜰 수 있어요.\n그럴 땐 도보 이동을 고려해보세요.";
    }

    if (!props.dateDone) {
      return "날짜를 먼저 선택해 주세요.\n날짜가 있어야 출발 시간을 정확히 계산할 수 있어요.";
    }

    if (!props.timeDone) {
      return "심야 시간에는 대중교통 운행이 제한될 수 있어요.\n택시나 자가용 이동을 추천해요.";
    }

    if (!props.titleDone) {
      return "약속 제목을 적어두면 나중에 목록에서 찾기 쉬워요.";
    }

    if (!props.routeDone) {
      return "이동 시간은 최근 교통 데이터를\n 기반으로 한 평균값이에요.\n실제 상황에 따라 조금 달라질 수 있어요.";
    }

    return "약속 저장 후 출발 10분 전부터\n사진을 찍어 출발 인증이 가능해요.";

  }, [props.destDone, props.dateDone, props.timeDone, props.titleDone, props.routeDone]);


  return (
    <View style={styles.infoCard}>
      <Text style={styles.tipTitle}>💡 Tip</Text>
      <View style={styles.bearGuideWrap}>
        <Image source={bearSetting} style={styles.bearGuideImg} resizeMode="contain" />
        <View style={styles.bearBubble}>
          <Text style={styles.bearBubbleText} numberOfLines={3} ellipsizeMode="tail">
            {tipText}
          </Text>
        </View>
      </View>
    </View>
  );
}
