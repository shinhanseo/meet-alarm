import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";


export default function HeaderBar() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>지금이니</Text>
    </View>
  );
}
