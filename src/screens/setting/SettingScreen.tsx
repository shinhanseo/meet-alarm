import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { usePlacesStore } from "@/store/usePlacesStore";
import { THEME } from "@/src/styles/theme";
import { styles } from "./styles";

function SettingRow({
  title,
  desc,
  icon,
  onPress,
  badgeText,
}: {
  title: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  badgeText?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={icon} size={20} color={THEME.orangeDark} />
        </View>

        <View style={styles.texts}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{title}</Text>
            {!!badgeText && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </View>

          <Text style={styles.cardDesc} numberOfLines={1}>
            {desc}
          </Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={THEME.muted} />
    </Pressable>
  );
}

export default function SettingScreen() {
  const router = useRouter();
  const { myHouse } = usePlacesStore();

  const houseDesc = myHouse
    ? `${myHouse.address}`
    : "등록하면 한 번 탭으로 선택 가능";

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.replace("/create-meeting")} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={THEME.text} />
          </Pressable>

          <Text style={styles.title}>설정</Text>

          {/* 오른쪽 균형용 */}
          <View style={styles.rightSpacer} />
        </View>

        <Text style={styles.subtitle}>우리집, 여유 시간을 설정할 수 있어요</Text>
      </View>

      {/* 섹션 */}
      <Text style={styles.sectionTitle}>출발지 기준</Text>

      <SettingRow
        title="우리집"
        desc={houseDesc}
        icon="home"
        badgeText={myHouse ? "등록됨" : "미등록"}
        onPress={() =>
          router.push({
            pathname: "/place-search",
            params: { mode: "origin", scope: "house" },
          })
        }
      />
    </View>
  );
}

