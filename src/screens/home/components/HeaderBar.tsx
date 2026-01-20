import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

export default function HeaderBar({ onPressReset }: { onPressReset: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>지금이니</Text>
      <Pressable onPress={onPressReset} style={styles.resetBtnTop}>
        <Text style={styles.resetTextTop}>약속 삭제</Text>
      </Pressable>
    </View>
  );
}
