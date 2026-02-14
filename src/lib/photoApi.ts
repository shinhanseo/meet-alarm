import * as ImageManipulator from "expo-image-manipulator";
import { API_BASE_URL } from "@/src/config/env";
import { PHOTO_CONSTANTS } from "@/src/constants";
import axios from "axios";
import { cropToFrame } from "@/src/lib/crop";

export type PhotoVerdict = {
  isShoe: boolean;
  confidence: number;
  reaseon?: string;
  labels?: string[];
};

type FormDataImage = {
  uri: string;
  name: string;
  type: string;
};

export async function sendPhotoForVerdict(photoUri: string): Promise<PhotoVerdict> {
  const croppedUri = await cropToFrame(photoUri);

  const manipulated = await ImageManipulator.manipulateAsync(
    croppedUri,
    [{ resize: { width: PHOTO_CONSTANTS.RESIZE_WIDTH } }],
    { compress: PHOTO_CONSTANTS.COMPRESS_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );

  const form = new FormData();

  const imageData: FormDataImage = {
    uri: manipulated.uri,
    name: `photo_${Date.now()}.jpg`,
    type: "image/jpeg",
  };

  form.append("image", imageData as unknown as Blob);

  const res = await axios.post<PhotoVerdict>(`${API_BASE_URL}/api/photoVerdict`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: PHOTO_CONSTANTS.API_TIMEOUT,
  });

  return res.data;
}