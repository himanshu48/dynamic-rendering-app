import { FC } from "react";

interface ITextFieldProps {
  onChange: (value: string) => void
  type: "text" | "email" | "password";
  label: string | undefined;
}

const TextField: FC<ITextFieldProps> = (props) => {
  const { label, onChange, type } = props;

  const onValueChange = (e: any) => {
    onChange(e.target.value)
  }
  return (
    <div style={{ marginTop: "10px" }}>
      <div>{label}</div>
      <input onChange={onValueChange} style={{ width: "100%" }} type={type} />
    </div>
  );
};

export default TextField;
