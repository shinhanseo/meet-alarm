import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

type Props = {
  onPressCamera: () => void;
  cameraDisabled?: boolean;
};

export default function HeaderBar({ onPressCamera, cameraDisabled }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>지금이니</Text>

      <Pressable
        onPress={onPressCamera}
        disabled={cameraDisabled}
        style={[
          styles.cameraBtnTop,
          cameraDisabled && { opacity: 0.4 },
        ]}
      >
        <Ionicons name="camera" size={20} color="#333" />
      </Pressable>
    </View>
  );
}
