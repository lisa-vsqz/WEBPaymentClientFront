import { DatePicker, DatePickerProps } from "@progress/kendo-react-dateinputs";

export type MyDatePickerProps = DatePickerProps & {
  errorMessage?: string;
};

const MyDatePicker = (props: MyDatePickerProps) => {
  const { errorMessage, ...datePickerProps } = props;
  return (
    <>
      <DatePicker format="MM-dd-yyyy" {...datePickerProps} />
      {errorMessage ? (
        <p
          style={{ color: "red", margin: "0.5rem 0", display: "inline-block" }}
        >
          {errorMessage}
        </p>
      ) : null}
    </>
  );
};

export default MyDatePicker;
