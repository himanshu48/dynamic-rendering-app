import { query } from "@lib/server/db";
import { Exception } from "@lib/server/exception/exception";

export class StateMachineParamsDal {
  async getStateParamById(id: number) {
    const res = await query('SELECT * FROM state_machine_parameters WHERE state_param_id=$1', [id]);
    if (res.rowCount>0){
        return res.rows[0]
    }
    this.throwError(404, "Invalid stateParamId")
}

  getAllStateParam() {
    return query("SELECT * FROM state_machine_parameters", []);
  }

  private throwError(status: number, msg: string) {
    throw new Exception(status, msg);
  }
}