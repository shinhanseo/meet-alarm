import * as ImageManipulator from "expo-image-manipulator";
import { API_BASE_URL } from "@/src/config/env";
import axios from "axios";
import { cropToFrame } from "@/src/lib/crop";

export type PhotoVerdict = {
  isShoe: boolean;
  confidence: number;
  reaseon?: string;
  labels?: string[];
}

export async function sendPhotoForVerdict(photoUri: string): Promise<PhotoVerdict> {

  const croppedUri = await cropToFrame(photoUri);
  // 사진 리사이즈화
  const manipulated = await ImageManipulator.manipulateAsync(
    croppedUri,
    [{ resize: { width: 768 } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
  );

  const form = new FormData();

  form.append("image", {
    uri: manipulated.uri,
    name: `photo_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  const res = await axios.post<PhotoVerdict>(`${API_BASE_URL}/api/photoVerdict`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 20_000,
  });

  return res.data;
}