import { compare, hash } from "bcrypt";
import { StateMachineDal } from "../dal/stateMachine";
import { StateMachineParamsDal } from "../dal/stateMachineParameters";
import { StateMachineRoutingDal } from "../dal/stateMachineRouting";
import { Exception } from "../exception/exception";

const stateMachineDal = new StateMachineDal();
const stateMachineParamsDal = new StateMachineParamsDal();
const stateMachineRoutingDal = new StateMachineRoutingDal();

export const validateStateMachineInit = async (
  method: string | undefined,
  obj:
    | undefined
    | {
        requestParams: any;
        stateId: number;
      },
  opId: string
) => {
  if (method !== "POST") {
    throw new Exception(405, "method not allowed");
  }
  if (
    !obj ||
    !obj.hasOwnProperty("requestParams") ||
    !obj.hasOwnProperty("stateId")
  ) {
    throw new Exception(400, "requestParams or stateId missing");
  }

  if (Object.keys(obj.requestParams).length === 0 && obj.stateId === null) {
    const nextStateId = await stateMachineRoutingDal.getNextStateIdById(
      opId,
      0
    );
    const res2 = await stateMachineDal.getStateById(nextStateId);
    const params = res2.parameter_order;

    return {
      nextStateId,
      nextStateParams: params
        .split(",")
        .reduce((a: object, c: string) => ({ ...a, [c]: null }), {}),
      operationCompleted: false,
    };
  }
  return null;
};

export const validateStateMachineNextStep = async (
  stateId: number,
  opId: string
) => {
  const nextStateId = await stateMachineRoutingDal.getNextStateIdById(
    opId,
    stateId
  );
  if (nextStateId === 0) {
    return {
      nextStateId: null,
      nextStateParams: null,
      operationCompleted: true,
    };
  }
  const res = await stateMachineDal.getStateById(nextStateId);
  const params = res.parameter_order;
  return {
    nextStateId,
    nextStateParams: params
    .split(",")
    .reduce((a: object, c: string) => ({ ...a, [c]: null }), {}),
    operationCompleted: false,
  }
};

const validateStateParam = (
  stateParam: {
    param_type: string;
    optional_field: boolean;
    display_label: string;
    valid_possible_values: any[];
    min_length: number;
    max_length: number;
    regex: string | RegExp;
  },
  value: string | null | undefined
) => {
  if (["text", "email", "password"].includes(stateParam.param_type)) {
    if (value === null || value === undefined) {
      if (!stateParam.optional_field) {
        throw new Exception(400, `${stateParam.display_label} is required`);
      }
      return;
    }

    if (
      stateParam.valid_possible_values &&
      !stateParam.valid_possible_values.includes(value)
    ) {
      throw new Exception(
        400,
        "Invalid value:: value must be one of these " +
          stateParam.valid_possible_values.join(", ")
      );
    }

    if (stateParam.min_length > 0) {
      if (value.length < stateParam.min_length) {
        throw new Exception(
          400,
          `min length of ${stateParam.display_label} should be ${stateParam.min_length}`
        );
      }
    }

    if (stateParam.max_length > 0) {
      if (value.length > stateParam.max_length) {
        throw new Exception(
          400,
          `max length of ${stateParam.display_label} should be ${stateParam.max_length}`
        );
      }
    }

    if (stateParam.regex) {
      if (!value.match(new RegExp(stateParam.regex))) {
        throw new Exception(400, "Please enter a valid value.");
      }
    }
    if (stateParam.param_type === "email") {
      validateEmail(value);
    }
    if (stateParam.param_type === "password") {
      validatePassword(value);
    }
  }
};

const validateEmail = (email: string) => {
  if (!email.match(/^[a-z0-9+_.-]+@[a-z.-]+\.[a-z]{2,3}$/i)) {
    throw new Exception(400, "Please enter a valid email.");
  }
};

const validatePassword = (password: string) => {
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
    throw new Exception(400, "Please enter a valid password.");
  }
};

export const validateStateParams = async (
  ids: string[],
  requestParams: any
) => {
  const temp:any = {}
  const stateParams = ids.map(async (id: string) => {
    const stateParam = await stateMachineParamsDal.getStateParamById(
      parseInt(id)
    );
    validateStateParam(stateParam, requestParams[id]);
    temp[stateParam.state_param_key] = requestParams[id]
    return stateParam;
  });

  await Promise.all(stateParams);

  return temp;
};

export const encryptPassword = async(password: string) => {
  const temp = await hash(password, 10);
  return temp
}

export const comparePassword = async(password:string, hash: string) => {
  const result = await compare(password, hash)
  return result === true
}
