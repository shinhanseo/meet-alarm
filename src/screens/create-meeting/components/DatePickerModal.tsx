import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
  visible: boolean;
  date: Date;
  onConfirm: (picked: Date) => void;
  onCancel: () => void;
};

export function DatePickerModal(props: Props) {
  return (
    <DateTimePickerModal
      isVisible={props.visible}
      mode="date"
      date={props.date}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
      locale="ko_KR"
      confirmTextIOS="확인"
      cancelTextIOS="취소"
    />
  );
}
