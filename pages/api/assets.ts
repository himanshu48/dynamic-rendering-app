// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StateMachineDal } from "@lib/dal/stateMachine";
import { StateMachineParamsDal } from "@lib/dal/stateMachineParameters";
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

  const stateMachine = stateMachineData.rows.reduce(
    (a, c) => ({
      ...a,
      [c.state_id]: {
        description: c.description,
        parameterOrder: c.parameter_order,
        stateId: c.state_id,
        stateName: c.state_name,
        stateToken: c.state_token,
        title: c.title,
      },
    }),
    {}
  );

  const stateParams = stateMachineParamData.rows.reduce(
    (a, c) => ({
      ...a,
      [c.state_param_id]: {
        stateParamId: c.state_param_id,
        stateParamKey: c.state_param_key,
        displayOnUI: c.displayOnUI,
        displayLabel: c.display_label,
        helpText: c.help_text,
        max_length: c.maxLength,
        minLength: c.min_length,
        optionalField: c.optional_field,
        paramType: c.param_type,
        required: c.required,
        showHelpText: c.showHelpText,
        validPossibleValues: c.valid_possible_values,
      },
    }),
    {}
  );

  res.status(200).json({ stateMachine, stateParams });
}
