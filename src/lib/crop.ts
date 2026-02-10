import * as ImageManipulator from "expo-image-manipulator";
import { Dimensions } from "react-native";

export async function cropToFrame(photoUri: string) {
  const { width: screenW, height: screenH } = Dimensions.get("window");

  // 네 UI 기준
  const frameSize = 260;
  const topPercent = 0.2;

  // 화면 기준 프레임 좌표
  const frameX = (screenW - frameSize) / 2;
  const frameY = screenH * topPercent;

  // 사진 실제 크기
  const photo = await ImageManipulator.manipulateAsync(photoUri, []);
  const photoW = photo.width;
  const photoH = photo.height;

  // 화면 → 사진 비율
  const scaleX = photoW / screenW;
  const scaleY = photoH / screenH;

  const originX = frameX * scaleX;
  const originY = frameY * scaleY;
  const width = frameSize * scaleX;
  const height = frameSize * scaleY;

  const result = await ImageManipulator.manipulateAsync(
    photoUri,
    [
      {
        crop: {
          originX,
          originY,
          width,
          height,
        },
      },
    ],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
}
