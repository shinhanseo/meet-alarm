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

  return (
    <View style={styles.infoCard}>

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
    </View>
  );
}
