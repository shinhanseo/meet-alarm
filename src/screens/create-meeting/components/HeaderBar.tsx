import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { THEME } from "@/src/styles/theme";
import { useRouter } from "expo-router";
export function HeaderBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <MaterialIcons
          name="alarm"
          size={26}
          color={THEME.orange}
          style={{ marginLeft: 6 }}
        />
      </View>

      <Pressable style={{ padding: 6 }} onPress={() => router.push("/setting")}>
        <MaterialIcons name="settings" size={26} color={THEME.orange} />
      </Pressable>
    </View>
  );
}
