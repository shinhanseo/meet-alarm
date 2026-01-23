import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";

export function HeaderBar({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <MaterialIcons name="alarm" size={26} color={THEME.orange} />
    </View>
  );
}
