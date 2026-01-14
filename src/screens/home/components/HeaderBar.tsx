import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

export default function HeaderBar({ onPressCreate }: { onPressCreate: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>지금이니</Text>
      <Pressable onPress={onPressCreate} style={styles.headerBtn}>
        <Text style={styles.headerBtnText}>약속 설정</Text>
      </Pressable>
    </View>
  );
}
