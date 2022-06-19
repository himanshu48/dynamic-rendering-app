import { query } from "@lib/server/db";
import { Exception } from "@lib/server/exception/exception";
import Cache from "@lib/server/utils/cache";
import { IStateMachine } from "../interface/stateMachine";

export class StateMachineDal {
  async getStateById(id: number): Promise<IStateMachine> {
    const key = "StateMachineDal_getStateById_" + id;
    if (Cache.has(key)) {
      return Cache.get(key);
    }
    const res = await query("SELECT * FROM state_machine WHERE state_id=$1", [
      id,
    ]);
    if (res.rowCount > 0) {
      const data = mapStateMachine(res.rows)
      Cache.set(key, data[0]);
      return data[0];
    }
    this.throwError(404, "Invalid stateId");
  }

  async getStateByKey(key: string): Promise<IStateMachine> {
    const cKey = "StateMachineDal_getStateById_" + key;
    if (Cache.has(cKey)) {
      return Cache.get(cKey);
    }
    const res = await query("SELECT * FROM state_machine WHERE state_key=$1", [
      key,
    ]);
    if (res.rowCount > 0) {
      const data = mapStateMachine(res.rows)
      Cache.set(cKey, data[0]);
      return data[0];
    }
    this.throwError(404, "Invalid stateKey");
  }

  async getAllStates(): Promise<Array<IStateMachine>> {
    const key = "StateMachineDal_getAllStates";
    if (Cache.has(key)) {
      return Cache.get(key);
    }

    const res = await query("SELECT * FROM state_machine", []);
    const data = mapStateMachine(res.rows)
    Cache.set(key, data);
    return data;
  }

  private throwError(status: number, msg: string): never {
    throw new Exception(status, msg);
  }
}

interface IStateMachineDB {
  state_id: number;
  description: string;
  parameter_order: string;
  state_name: string;
  state_key: string;
  title: string;
}

const mapStateMachine = (data: Array<IStateMachineDB>) =>
  data.map((c: IStateMachineDB) => ({
    stateId: c.state_id,
    description: c.description,
    parameterOrder: c.parameter_order,
    stateName: c.state_name,
    stateKey: c.state_key,
    title: c.title,
  }));
