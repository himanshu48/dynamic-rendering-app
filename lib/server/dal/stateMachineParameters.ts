import { query } from "@lib/server/db";
import { Exception } from "@lib/server/exception/exception";
import Cache from "@lib/server/utils/cache";
import { IStateMachineParams } from "../interface/stateMachineParams";

export class StateMachineParamsDal {
  async getStateParamById(id: number): Promise<IStateMachineParams> {
    const key = "StateMachineParamsDal_getStateParamById_" + id;
    if (Cache.has(key)) {
      return Cache.get(key);
    }
    const res = await query(
      "SELECT * FROM state_machine_parameters WHERE state_param_id=$1",
      [id]
    );
    if (res.rowCount > 0) {
      const data = mapStateMachineParam(res.rows)
      Cache.set(key, data[0]);
      return data[0];
    }
    this.throwError(404, "Invalid stateParamId");
  }

  async getAllStateParam(): Promise<Array<IStateMachineParams>> {
    const key = "StateMachineParamsDal_getAllStateParam";
    if (Cache.has(key)) {
      return Cache.get(key);
    }
    const res = await query("SELECT * FROM state_machine_parameters", []);
    const data = mapStateMachineParam(res.rows)
    Cache.set(key, data);
    return data;
  }

  private throwError(status: number, msg: string): never {
    throw new Exception(status, msg);
  }
}


interface IStateMachineParamsDB {
  state_param_id: number;
  state_param_key: string;
  display_label: string;
  help_text: string;
  max_length: number;
  min_length: number;
  optional_field: boolean;
  param_type: string;
  valid_possible_values: string;
  regex: string;
}

const mapStateMachineParam = (data: Array<IStateMachineParamsDB>) =>
  data.map((c: IStateMachineParamsDB) => ({
    stateParamId: c.state_param_id,
    stateParamKey: c.state_param_key,
    displayLabel: c.display_label,
    helpText: c.help_text,
    maxLength: c.max_length,
    minLength: c.min_length,
    optionalField: c.optional_field,
    paramType: c.param_type,
    validPossibleValues: c.valid_possible_values,
    regex: c.regex,
  }));
