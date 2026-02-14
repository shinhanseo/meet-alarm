import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";

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

const progressItems = [
  { key: "origin", label: "출발지" },
  { key: "dest", label: "도착지" },
  { key: "date", label: "날짜" },
  { key: "time", label: "시간" },
  { key: "title", label: "제목" },
  { key: "route", label: "경로" },
];

export function ProgressSection(props: Props) {
  const getItemStatus = (key: string) => {
    switch (key) {
      case "origin":
        return props.originDone;
      case "dest":
        return props.destDone;
      case "date":
        return props.dateDone;
      case "time":
        return props.timeDone;
      case "title":
        return props.titleDone;
      case "route":
        return props.routeDone;
      default:
        return false;
    }
  };

  return (
    <View style={styles.infoCard}>
      <View style={styles.progressRowCompact}>
        {progressItems.map((item, index) => {
          const isDone = getItemStatus(item.key);
          const isLast = index === progressItems.length - 1;

          return (
            <View key={item.key} style={styles.progressItemCompact}>
              <View style={styles.progressDotContainer}>
                <View
                  style={[
                    styles.dotCompact,
                    isDone && styles.dotCompactOn,
                  ]}
                >
                  {isDone && (
                    <MaterialIcons
                      name="check"
                      size={10}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.progressTextCompact,
                    isDone && styles.progressTextCompactDone,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.progressConnectorCompact,
                    isDone && styles.progressConnectorCompactDone,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
