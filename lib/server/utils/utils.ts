import { compare, hash } from "bcrypt";
import { StateMachineDal } from "../dal/stateMachine";
import { StateMachineParamsDal } from "../dal/stateMachineParameters";
import { StateMachineRoutingDal } from "../dal/stateMachineRouting";
import { Exception } from "../exception/exception";
import { IStateMachineParams } from "../interface/stateMachineParams";

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
    const nextStateKey = await stateMachineRoutingDal.getNextStateKeyByKey(
      opId,
      null
    );
    const res2 = await stateMachineDal.getStateByKey(nextStateKey);
    const params = res2?.parameterOrder;

    return {
      nextStateId: res2?.stateId,
      nextStateParams: params
        .split(",")
        .reduce((a: object, c: string) => ({ ...a, [c]: null }), {}),
      operationCompleted: false,
    };
  }
  return null;
};

export const validateStateMachineNextStep = async (
  stateKey: string,
  opId: string
) => {
  const nextStateKey = await stateMachineRoutingDal.getNextStateKeyByKey(
    opId,
    stateKey
  );
  if (nextStateKey === null) {
    return {
      nextStateId: null,
      nextStateParams: null,
      operationCompleted: true,
    };
  }
  const res = await stateMachineDal.getStateByKey(nextStateKey);
  const params = res?.parameterOrder;
  return {
    nextStateId: res?.stateId,
    nextStateParams: params
    .split(",")
    .reduce((a: object, c: string) => ({ ...a, [c]: null }), {}),
    operationCompleted: false,
  }
};

const validateStateParam = (
  stateParam: IStateMachineParams,
  value: string | null | undefined
) => {
  if (["text", "email", "password"].includes(stateParam.paramType)) {
    if (value === null || value === undefined) {
      if (!stateParam?.optionalField) {
        throw new Exception(400, `${stateParam?.displayLabel} is required`);
      }
      return;
    }

    if (
      stateParam.validPossibleValues &&
      !stateParam.validPossibleValues.includes(value)
    ) {
      throw new Exception(
        400,
        "Invalid value:: value must be one of these " +
          stateParam.validPossibleValues
      );
    }

    if (stateParam?.minLength && stateParam.minLength > 0) {
      if (value.length < stateParam?.minLength) {
        throw new Exception(
          400,
          `min length of ${stateParam.displayLabel} should be ${stateParam.minLength}`
        );
      }
    }

    if (stateParam?.maxLength && stateParam.maxLength > 0) {
      if (value.length > stateParam.maxLength) {
        throw new Exception(
          400,
          `max length of ${stateParam.displayLabel} should be ${stateParam.maxLength}`
        );
      }
    }

    if (stateParam?.regex) {
      if (!value.match(new RegExp(stateParam.regex))) {
        throw new Exception(400, "Please enter a valid value.");
      }
    }
    if (stateParam.paramType === "email") {
      validateEmail(value);
    }
    if (stateParam.paramType === "password") {
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
    temp[stateParam?.stateParamKey] = requestParams[id]
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
