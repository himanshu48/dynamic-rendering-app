import { StateMachineKey } from "@lib/server/constants/stateMachineKey";
import { StateParamsKey } from "@lib/server/constants/stateMachineParamsKey";
import { StateMachineDal } from "@lib/server/dal/stateMachine";
import { UserDal } from "@lib/server/dal/user";
import { Exception } from "@lib/server/exception/exception";
import { StateMachineResponse } from "@lib/server/interface/stateMachineResponse";
import {
  comparePassword,
  validateStateMachineInit,
  validateStateMachineNextStep,
  validateStateParams,
} from "@lib/server/utils/utils";
import type { NextApiRequest, NextApiResponse } from "next";

const stateMachineDal = new StateMachineDal();
const userDal = new UserDal();

const opId = "LOGIN";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StateMachineResponse>
) {
  try {
    const obj = req.body;

    const res1 = await validateStateMachineInit(req.method, obj, opId);
    if (res1 !== null) {
      res
        .status(200)
        .json({ responseData: res1, responseInfo: { type: "success" } });
    }

    const currentState = await stateMachineDal.getStateById(obj.stateId);
    const requestParamsMapped = await validateStateParams(
      currentState.parameter_order.split(","),
      obj.requestParams
    );

    if (currentState.state_key === StateMachineKey.loginInitial) {
      await loginInitial(requestParamsMapped);
    }

    const res3 = await validateStateMachineNextStep(obj.stateId, opId);
    res.status(200).json({
      responseData: res3,
      responseInfo: {
        type: "success",
      },
    });
  } catch (error: any) {
    console.warn(error);
    res.status(400).json({
      responseData: {
        nextStateId: req.body.stateId,
        nextStateParams: req.body.requestParams,
        operationCompleted: false,
      },
      responseInfo: { type: "error", errMsg: error?.message },
    });
  }
}

const loginInitial = async (reqParams: any) => {
  const user = await userDal.getUserByUsername(
    reqParams[StateParamsKey.username]
  );

  const status = await comparePassword(
    reqParams[StateParamsKey.password],
    user.password
  );

  if (!status) {
    throw new Exception(400, "Incorrect Password.");
  }
};
