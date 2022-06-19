import { query } from "@lib/server/db";
import { Exception } from "@lib/server/exception/exception";
import Cache from "@lib/server/utils/cache";

export class StateMachineRoutingDal {
  async getNextStateKeyByKey(opId: string, currentStateKey: string | null) {
    const key =
      "StateMachineRoutingDal_StateMachineRoutingDal_" +
      opId +
      "_" +
      currentStateKey;
    if (Cache.has(key)) {
      return Cache.get(key);
    }
    const res =
      currentStateKey === null
        ? await query(
            "SELECT next_state_key FROM state_machine_routing WHERE op_id=$1 and current_state_key is NULL",
            [opId]
          )
        : await query(
            "SELECT next_state_key FROM state_machine_routing WHERE op_id=$1 and current_state_key=$2",
            [opId, currentStateKey]
          );
    if (res.rowCount > 0) {
      Cache.set(key, res.rows[0].next_state_key);
      return res.rows[0].next_state_key;
    }
    this.throwError(404, "Invalid stateKey");
  }

  private throwError(status: number, msg: string) {
    throw new Exception(status, msg);
  }
}
