import { query } from "@lib/db";
import { DbException } from "@lib/exception/dbException";

export class StateMachineDal {
  async getStateById(id: number) {
    const res = await query("SELECT * FROM state_machine WHERE state_id=$1", [
      id,
    ]);
    if (res.rowCount > 0) {
      return res.rows[0];
    }
    this.throwError(404, "Invalid stateId");
  }

  getAllStates() {
    return query("SELECT * FROM state_machine", []);
  }

  private throwError(status: number, msg: string) {
    throw new DbException(status, msg);
  }
}
