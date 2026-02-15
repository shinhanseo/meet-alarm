import { View, Text, TextInput, Pressable } from "react-native";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  originName: string;
  destName: string;

  onPressOrigin: () => void;
  onPressDest: () => void;

  onPressMyHouse: () => void;
  myHouseEnabled: boolean;

  meetingDateLabel: string;
  isTodayActive: boolean;
  isTomorrowActive: boolean;
  onPressToday: () => void;
  onPressTomorrow: () => void;
  onPressCalendar: () => void;

  meetingTime: string;
  meetingTitle: string;
  onChangeMeetingTitle: (v: string) => void;
  onPressTime: () => void;
};

export function InputCard(props: Props) {
  return (
    <View style={styles.card}>

      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={18} color={THEME.orange} />
          <Text style={styles.label}>출발</Text>

          <Pressable onPress={props.onPressOrigin} style={{ flex: 1 }}>
            <View style={styles.fakeInput}>
              <Text
                style={[
                  styles.fakeInputText,
                  !props.originName && { color: THEME.placeholder },
                ]}
                numberOfLines={1}
              >
                {props.originName || "출발지를 입력하세요"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={props.onPressMyHouse}
            style={[
              styles.houseBtn,
              props.myHouseEnabled ? styles.houseBtnOn : styles.houseBtnOff,
            ]}
            hitSlop={8}
          >
            <Text
              style={[
                styles.houseBtnText,
                props.myHouseEnabled
                  ? styles.houseBtnTextOn
                  : styles.houseBtnTextOff,
              ]}
              numberOfLines={1}
            >
              우리집
            </Text>
          </Pressable>
        </View>

        {/* 도착  */}
        <View style={styles.row}>
          <MaterialIcons name="flag" size={18} color={THEME.orange} />
          <Text style={styles.label}>도착</Text>

          <Pressable onPress={props.onPressDest} style={{ flex: 1 }}>
            <View style={styles.fakeInput}>
              <Text
                style={[
                  styles.fakeInputText,
                  !props.destName && { color: THEME.placeholder },
                ]}
                numberOfLines={1}
              >
                {props.destName || "도착지는 어디인가요?"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 날짜 */}
        <View style={styles.row}>
          <MaterialIcons name="event" size={18} color={THEME.orange} />
          <Text style={styles.label}>날짜</Text>

          <Pressable onPress={props.onPressCalendar} style={{ flex: 1 }}>
            <View style={styles.fakeInput}>
              <Text style={styles.fakeInputText} numberOfLines={1}>
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
        </View>

        {/* 시간 */}
        <View style={styles.row}>
          <MaterialIcons name="schedule" size={18} color={THEME.orange} />
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

        {/* 제목 */}
        <View style={styles.row}>
          <MaterialIcons name="edit" size={18} color={THEME.orange} />
          <Text style={styles.label}>제목</Text>

          <TextInput
            value={props.meetingTitle}
            onChangeText={props.onChangeMeetingTitle}
            placeholder="무슨 약속인가요?"
            placeholderTextColor={THEME.placeholder}
            style={styles.input}
            returnKeyType="done"
          />
        </View>
      </View>
    </View>
  );
}
