import Button from "@components/uiComponents/button/button";
import Label from "@components/uiComponents/label/label";
import TextField from "@components/uiComponents/textField/textField";
import { FC } from "react";

interface IDynamicFieldProps {
  paramType: string;
  label?: string;
  minLength: number;
  maxLength: number;
  helpText?: string;
  radioValues?: Array<any>;
  onValueChange: (value:string) => void
  onAction: (action:'submit' | 'cancel') => void
}

const DynamicField: FC<IDynamicFieldProps> = (props) => {
  const { label, onAction, onValueChange, paramType } = props;

  const onChangeInput = (value: string) => {
    onValueChange(value)
  }

  return (
    <div className="dynamic-field">
      {(() => {
        switch (paramType.toLowerCase()) {
          case "text":
            return <TextField onChange={onChangeInput} type="text" label={label} />;
          case "email":
            return <TextField onChange={onChangeInput} type="email" label={label} />;
          case "password":
            return <TextField onChange={onChangeInput} type="password" label={label} />;
          case "submitbutton":
            return <Button onButtonClick={()=>onAction('submit')} label={label || "Submit"} />;
          case "label":
            return <Label text={label} />;

          default:
            return null;
        }
      })()}
    </div>
  );
};

export default DynamicField;
