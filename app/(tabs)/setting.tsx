import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';


export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정 예정</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // 흰 글자 보이게
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

