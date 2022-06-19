// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StateMachineDal } from "@lib/server/dal/stateMachine";
import { StateMachineParamsDal } from "@lib/server/dal/stateMachineParameters";
import { IStateMachine } from "@lib/server/interface/stateMachine";
import { IStateMachineParams } from "@lib/server/interface/stateMachineParams";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  stateMachine: any;
  stateParams: any;
};

const stateMachineDal = new StateMachineDal();
const stateMachineParamsDal = new StateMachineParamsDal();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const stateMachineData = await stateMachineDal.getAllStates();
  const stateMachineParamData = await stateMachineParamsDal.getAllStateParam();

  const stateMachine = stateMachineData.reduce(
    (a: any, c: IStateMachine) => ({
      ...a,
      [c.stateId]: c,
    }),
    {}
  );

  const stateParams = stateMachineParamData.reduce(
    (a: any, c: IStateMachineParams) => ({
      ...a,
      [c.stateParamId]: c,
    }),
    {}
  );

  res.status(200).json({ stateMachine, stateParams });
}
