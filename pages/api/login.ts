import jwt from 'jsonwebtoken';
import cookie from 'cookie';

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
        .json({ responseData: res1 as any, responseInfo: { type: "success" } });
    } else {
      const currentState = await stateMachineDal.getStateById(obj.stateId);
      const requestParamsMapped = await validateStateParams(
        currentState?.parameterOrder.split(",")||[],
        obj.requestParams
      );

      if (currentState?.stateKey === StateMachineKey.loginInitial) {
        await loginInitial(requestParamsMapped);
      }

      const res3 = await validateStateMachineNextStep(currentState?.stateKey, opId);
      if(res3?.operationCompleted) {
        const token = jwt.sign({ foo: 'bar' }, process.env.JWT_TOKEN as string, { expiresIn: '24h' });
        
        res.setHeader('Set-Cookie', [
          cookie.serialize('token', `Bearer ${token}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
            path: '/'
          })
        ]);

      }

      res.status(200).json({
        responseData: res3 as any,
        responseInfo: {
          type: "success",
        },
      });
    }
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
