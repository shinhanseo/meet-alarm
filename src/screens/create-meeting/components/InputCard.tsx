import { View, Text, TextInput, Pressable } from "react-native";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";

type Props = {
  originName: string;
  destName: string;

  onPressOrigin: () => void;
  onPressDest: () => void;

  meetingDateLabel: string;
  isTodayActive: boolean;
  isTomorrowActive: boolean;
  onPressToday: () => void;
  onPressTomorrow: () => void;
  onPressCalendar: () => void;

  meetingTime: string;
  onPressTime: () => void;
};

export function InputCard(props: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={{ flex: 1 }}>
        <Pressable onPress={props.onPressOrigin} style={styles.row}>
          <Text style={styles.label}>출발</Text>
          <TextInput
            value={props.originName}
            placeholder="출발지를 입력하세요"
            placeholderTextColor={THEME.placeholder}
            style={styles.input}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        <Pressable onPress={props.onPressDest} style={styles.row}>
          <Text style={styles.label}>도착</Text>
          <TextInput
            value={props.destName}
            placeholder="도착지는 어디인가요?"
            placeholderTextColor={THEME.placeholder}
            style={styles.input}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        <View style={styles.row}>
          <Text style={styles.label}>날짜</Text>

          <Pressable onPress={props.onPressCalendar} style={{ flex: 1 }}>
            <View style={styles.fakeInput}>
              <Text style={styles.fakeInputText}>
                {props.meetingDateLabel || "약속 날짜"}
              </Text>
            </View>
          </Pressable>

          <View style={styles.segment}>
            <Pressable
              onPress={props.onPressToday}
              style={[
                styles.segmentBtn,
                props.isTodayActive && styles.segmenttodayBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  props.isTodayActive && styles.segmentTextActive,
                ]}
              >
                오늘
              </Text>
            </Pressable>

            <View style={styles.segmentDivider} />

            <Pressable
              onPress={props.onPressTomorrow}
              style={[
                styles.segmentBtn,
                props.isTomorrowActive && styles.segmenttomorrowBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  props.isTomorrowActive && styles.segmentTextActive,
                ]}
              >
                내일
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={props.onPressCalendar} style={styles.calendarBtn}>
            <Text style={styles.calendarText}>📅</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>시간</Text>

          <Pressable onPress={props.onPressTime} style={styles.timePressable}>
            <TextInput
              value={props.meetingTime}
              placeholder="언제 만나기로 하셨나요?"
              placeholderTextColor={THEME.placeholder}
              style={styles.timeinput}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
