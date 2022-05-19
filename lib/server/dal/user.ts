import { query } from "@lib/server/db";
import { Exception } from "@lib/server/exception/exception";
import { IUser } from "@lib/server/interface/user";

export class UserDal {
  async create(user: IUser) {
    try {
      const res = await query(
        "INSERT INTO user_details (name, username, email, password) VALUES ($1, $2, $3, $4)",
        [user.name, user.username, user.email, user.password]
      );
      if (res.rowCount > 0) {
        return null;
      }
      this.throwError(404, "User not created");
    } catch (error) {
      console.warn("DBException:", JSON.stringify(error));
      this.throwError(400, "User not created");
    }
  }

  async getUserByUsername(username: string) {
    const res = await query("SELECT * FROM user WHERE username=$1", [
      username,
    ]);
    if (res.rowCount > 0) {
      return res.rows[0];
    }
    this.throwError(404, "Invalid username");
  }

  private throwError(status: number, msg: string) {
    throw new Exception(status, msg);
  }
}
