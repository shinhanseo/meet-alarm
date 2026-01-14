import { View, Text, Pressable, TextInput } from "react-native";
import { styles } from "../styles";

type Props = {
  timeText: string;
  meetingDayOffset: 0 | 1;
  onPressTime: () => void;
  onSelectToday: () => void;
  onSelectTomorrow: () => void;
};

export default function DateSection({
  timeText,
  meetingDayOffset,
  onPressTime,
  onSelectToday,
  onSelectTomorrow,
}: Props) {
  return (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabel}>시간</Text>

      <Pressable onPress={onPressTime} style={styles.dateTimePressable}>
        <TextInput
          value={timeText}
          placeholder="약속 시간"
          placeholderTextColor="#9AA0A6"
          style={styles.dateTimeInput}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <View style={styles.dateSegment}>
        <Pressable
          onPress={onSelectToday}
          style={[
            styles.dateSegmentBtn,
            meetingDayOffset === 0 && styles.dateSegmentBtnActive,
          ]}
        >
          <Text
            style={[
              styles.dateSegmentText,
              meetingDayOffset === 0 && styles.dateSegmentTextActive,
            ]}
          >
            오늘
          </Text>
        </Pressable>

        <Pressable
          onPress={onSelectTomorrow}
          style={[
            styles.dateSegmentBtn,
            meetingDayOffset === 1 && styles.dateSegmentBtnActive,
          ]}
        >
          <Text
            style={[
              styles.dateSegmentText,
              meetingDayOffset === 1 && styles.dateSegmentTextActive,
            ]}
          >
            내일
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
