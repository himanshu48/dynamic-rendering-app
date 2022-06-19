import ViewStateParam from "@components/viewStateParam/viewStateParam";
import { IStepInfo } from "@lib/client/interface/stepInfo";
import { fetchLogin } from "@lib/client/services/stepInfo";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface ILoginProps {
  assets: any;
}

const Login: FC<ILoginProps> = (props) => {
  const router = useRouter();
  const stateParam = props.assets?.stateParams;
  const stateMachine = props.assets?.stateMachine;

  const [stepInfo, setStepInfo] = useState<IStepInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchLogin({ stateId: null, requestParams: {} });
      setStepInfo(res.responseData);
    }
    fetchData();
  }, []);

  const onEventCallback = async (action: string, value: any) => {
    if (action === "submit") {
      const res = await fetchLogin(value);
      if (res.responseData.operationCompleted){
        router.push("/")
        setStepInfo(null)
      } else {
        setStepInfo(res.responseData);
      }
    }
  };

  return stateParam && stateMachine && stepInfo ? (
    <div className="small-page">
      <h2 className="page-title">
        {stateMachine[stepInfo?.nextStateId || ""]?.title}
      </h2>
      <ViewStateParam
        stateMachine={stateMachine}
        stateParam={stateParam}
        stepInfo={stepInfo}
        onEventCallback={onEventCallback}
      />
    </div>
  ) : null;
};

export default Login;
