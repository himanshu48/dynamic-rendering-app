import { FC } from "react";

interface IButtonProps {
  label: string;
  onButtonClick: () => void;
}

const Button: FC<IButtonProps> = (props) => {
  const { label, onButtonClick } = props;
  return (
    <div style={{ textAlign: "center" }}>
      <button
        style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "10px" }}
        onClick={onButtonClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
