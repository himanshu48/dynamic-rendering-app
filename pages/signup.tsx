import ViewStateParam from "@components/viewStateParam/viewStateParam";
import { IStepInfo } from "@lib/client/interface/stepInfo";
import { fetchSignup } from "@lib/client/services/stepInfo";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface ISignupProps {
  assets: any;
}

const Signup: FC<ISignupProps> = (props) => {
  const router = useRouter();
  const stateParam = props.assets?.stateParams;
  const stateMachine = props.assets?.stateMachine;

  const [stepInfo, setStepInfo] = useState<IStepInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchSignup({ stateId: null, requestParams: {} });
      setStepInfo(res.responseData);
    }
    fetchData();
  }, []);

  const onEventCallback = async (action: string, value: any) => {
    if (action === "submit") {
      const res = await fetchSignup(value);
      if (res.responseData.operationCompleted){
        router.push("/login")
        setStepInfo(null)
      } else {
        setStepInfo(res.responseData);
      }
    }
  };

  return stateParam && stateMachine && stepInfo ? (
    <div className="small-page">
      <h2 className="page-title">{stateMachine[stepInfo?.nextStateId || '']?.title}</h2>
      <ViewStateParam
        stateMachine={stateMachine}
        stateParam={stateParam}
        stepInfo={stepInfo}
        onEventCallback={onEventCallback}
      />
    </div>
  ) : null;
};

export default Signup;
