import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

type Props = {
  readyToSave: boolean;
  selectedRouteExists: boolean;
  onPressSave: () => void;
};

export function BottomBar(props: Props) {
  return (
    <View style={styles.bottomBar}>
      <Pressable
        onPress={props.onPressSave}
        disabled={!props.readyToSave}
        style={[styles.saveBtn, !props.readyToSave && { opacity: 0.55 }]}
      >
        <Text style={styles.saveBtnText}>
          {props.readyToSave ? "약속 저장하기" : "경로까지 선택하면 저장할 수 있어요"}
        </Text>
      </Pressable>

      <Text style={styles.bottomHint}>
        {props.readyToSave
          ? "저장하면 홈에서 출발 타이머와 알림이 자동으로 설정돼요."
          : props.selectedRouteExists
            ? "필수 입력을 확인해 주세요."
            : "경로를 선택하면 저장 버튼이 활성화돼요."}
      </Text>
    </View>
  );
}
