import { StateMachineDal } from "@lib/server/dal/stateMachine";
import { StateMachineParamsDal } from "@lib/server/dal/stateMachineParameters";
import { StateMachineRoutingDal } from "@lib/server/dal/stateMachineRouting";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  nextStateId: string
  nextStateParams: any
  operationCompleted: boolean
};

const stateMachineDal = new StateMachineDal();
const stateMachineParamsDal = new StateMachineParamsDal();
const stateMachineRoutingDal = new StateMachineRoutingDal();

const opId = "SIGNUP";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const obj = req.body;
  if (!obj.hasOwnProperty("requestParams") || !obj.hasOwnProperty("stateId")) {
    res.status(400);
  }

  if (Object.keys(obj.requestParams).length === 0 && obj.stateId === null) {
    const nextStateId = await stateMachineRoutingDal.getNextStateIdById(
      opId,
      0
    );
    const res2 = await stateMachineDal.getStateById(nextStateId);
    const params = res2.parameter_order;

    res.status(200).json({
      nextStateId,
      nextStateParams: params
        .split(",")
        .reduce((a: object, c: string) => ({ ...a, [c]: null }), {}),
      operationCompleted: false,
    });
  }

  res.status(200);
}
