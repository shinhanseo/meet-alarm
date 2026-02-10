import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system/legacy";

const TM_URL = "https://teachablemachine.withgoogle.com/models/1I7zRWCEY/";
const MODEL_URL = TM_URL + "model.json";

const IDX_SHOE = 0;
const IDX_NOT = 1;

let model: tf.LayersModel | null = null;

export async function loadShoeModel() {
  if (model) return model;

  await tf.ready();
  model = await tf.loadLayersModel(MODEL_URL);
  return model;
}

async function imageToTensor(uri: string) {
  const imgB64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

  const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
  const bytes = new Uint8Array(imgBuffer);

  // tidy로 중간 텐서 정리
  const input = tf.tidy(() => {
    const imageTensor = decodeJpeg(bytes);                 // [H,W,3]
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalized = resized.toFloat().div(255).expandDims(0); // [1,224,224,3]
    return normalized;
  });

  return input;
}

export async function predictShoe(uri: string) {
  const m = await loadShoeModel();

  // 1) input 만들기 (tensor)
  const input = await imageToTensor(uri);

  // 2) predict는 tidy로 감싸서 중간 텐서 정리
  const pred = tf.tidy(() => m.predict(input) as tf.Tensor);

  // 3) data()는 async니까 tidy 밖에서
  const probs = Array.from(await pred.data());

  // 4) 직접 정리 (필수)
  input.dispose();
  pred.dispose();

  return {
    shoe: probs[IDX_SHOE] ?? 0,
    notShoe: probs[IDX_NOT] ?? 0,
  };
}

