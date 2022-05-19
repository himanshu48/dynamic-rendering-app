import ViewStateParam from "@components/viewStateParam/viewStateParam";
import { FC, useEffect, useState } from "react";

interface ILoginProps {
  assets: any;
}

const Login: FC<ILoginProps> = (props) => {
  const stateParam = props.assets?.stateParams;
  const stateMachine = props.assets?.stateMachine;

  const [stepInfo, setStepInfo] = useState<null>(null);

  useEffect(() => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stateId: null, requestParams: {} }),
    })
      .then((res) => res.json())
      .then((res) => setStepInfo(res.responseData));
  }, []);
  console.log(stepInfo);


  return stateParam && stateMachine && stepInfo ? (
    <div>
      <h2>Login</h2>
      <ViewStateParam
        stateMachine={stateMachine}
        stateParam={stateParam}
        stepInfo={stepInfo}
      />
    </div>
  ) : null;
};

export default Login;
