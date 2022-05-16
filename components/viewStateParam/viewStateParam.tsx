import DynamicField from "@components/dynamicField/dynamicField";
import { FC, useEffect, useState } from "react";

interface IViewStateParamProps {
  stateParam: any;
  stateMachine: any;
  stepInfo: any;
}

const ViewStateParam: FC<IViewStateParamProps> = (props) => {
  const { stateParam, stateMachine, stepInfo } = props;
  const [nextStateParam, setNextStateParam] = useState<any>(null);
  const [stateParamOrder, setStateParamOrder] = useState<any>([]);

  useEffect(() => {
    const tempParam = stepInfo?.nextStateParams;
    Object.keys(tempParam).forEach((stateId: string) => {
      tempParam[stateId] = {
        paramType: stateParam[stateId]?.paramType,
      };
    });
    setNextStateParam(tempParam);
    setStateParamOrder(
      stateMachine[stepInfo?.nextStateId]?.parameterOrder?.split(",") || []
    );
  }, []);
  return (
    nextStateParam &&
    Object.keys(nextStateParam).length > 0 &&
    stateParamOrder.map((stateKey: string) => {
      return (
        stateParam && (
          <div className="dynamic-container">
            <DynamicField paramType={nextStateParam[stateKey]?.paramType} />
          </div>
        )
      );
    })
  );
};

export default ViewStateParam;
