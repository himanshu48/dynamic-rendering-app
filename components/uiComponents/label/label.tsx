import { FC } from "react";

interface ILabelProps {
  text: string | undefined;
}

const Label: FC<ILabelProps> = (props) => {
  const { text } = props;
  const labelStyle = {
    fontSize: "14px",
    marginTop: "10px",
  };
  return <>{text && <div style={labelStyle}>{text}</div>}</>;
};

export default Label;
