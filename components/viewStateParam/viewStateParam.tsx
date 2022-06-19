import DynamicField from "@components/dynamicField/dynamicField";
import { FC, useEffect, useState } from "react";

interface IViewStateParamProps {
  stateParam: any;
  stateMachine: any;
  stepInfo: any;
  onEventCallback: (action:string, value: any) => void
}

const ViewStateParam: FC<IViewStateParamProps> = (props) => {
  const {onEventCallback, stateParam, stateMachine, stepInfo } = props;
  const [nextStateParam, setNextStateParam] = useState<any>(null);
  const [stateParamOrder, setStateParamOrder] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

  useEffect(() => {
    const tempParam = stepInfo?.nextStateParams;
    Object.keys(tempParam).forEach((stateId: string) => {
      tempParam[stateId] = {
        paramType: stateParam[stateId]?.paramType,
        label: stateParam[stateId]?.displayLabel,
        minLength: stateParam[stateId]?.minLength,
        maxLength: stateParam[stateId]?.maxLength,
        helpText: stateParam[stateId]?.helpText,
        radioValues: stateParam[stateId]?.validPossibleValues,
      };
    });
    setNextStateParam(tempParam);
    setStateParamOrder(
      stateMachine[stepInfo?.nextStateId]?.parameterOrder?.split(",") || []
    );
  }, []);

  const onValueChange = (key:string, value:string) => {
    const temp = {...formValue}
    temp[key] = value
    setFormValue(temp)
  }
  const onActionCallback = (action:string) => {
    const temp = {
      stateId: stepInfo?.nextStateId,
      requestParams: formValue
    }
    onEventCallback(action, temp)
  }

  return (
    nextStateParam &&
    Object.keys(nextStateParam).length > 0 &&
    stateParamOrder.map((stateId: string) => {
      return (
        <div key={stateId} className="dynamic-container">
          <DynamicField
            paramType={nextStateParam[stateId]?.paramType}
            label={nextStateParam[stateId]?.label}
            minLength={nextStateParam[stateId]?.minLength}
            maxLength={nextStateParam[stateId]?.maxLength}
            helpText={nextStateParam[stateId]?.helpText}
            radioValues={nextStateParam[stateId]?.radioValues}
            onValueChange={(value:string) => onValueChange(stateId, value)}
            onAction={onActionCallback}
          />
        </div>
      );
    })
  );
};

export default ViewStateParam;
