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
    </View>
  );
}
