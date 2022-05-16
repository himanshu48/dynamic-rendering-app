import { query } from "@lib/db";
import { DbException } from "@lib/exception/dbException";

export class StateMachineRoutingDal {
  async getNextStateIdById(opId: string, currentStateId: number) {
    const res = await query('SELECT next_state_id FROM state_machine_routing WHERE op_id=$1 and current_state_id=$2', [opId, currentStateId]);
    if (res.rowCount>0){
        return res.rows[0].next_state_id
    }
    this.throwError(404, "Invalid stateId")
}

  private throwError(status: number, msg: string) {
    throw new DbException(status, msg);
  }
}
