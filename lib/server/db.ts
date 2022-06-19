import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(process.env.PGSQL_PORT || "5432"),
  database: process.env.PGSQL_DATABASE,
  max: 5,
});

const state_machine = `
    CREATE TABLE IF NOT EXISTS "state_machine" (
	    "state_id" SERIAL PRIMARY KEY,
	    "state_name" VARCHAR(100) NOT NULL,
	    "state_key" VARCHAR(100) NOT NULL UNIQUE,
	    "description" VARCHAR(200),
	    "parameter_order" VARCHAR(100) NOT NULL,
	    "title" VARCHAR(100)
    );`;
const state_machine_routing = `
    CREATE TABLE IF NOT EXISTS "state_machine_routing" (
	    "id" SERIAL PRIMARY KEY,
	    "current_state_key" VARCHAR(100),
	    "next_state_key" VARCHAR(100),
	    "op_id" VARCHAR(100) NOT NULL
    );`;

const state_machine_parameters = `
    CREATE TABLE IF NOT EXISTS "state_machine_parameters" (
	    "state_param_id" SERIAL PRIMARY KEY,
	    "state_param_key" VARCHAR(100) NOT NULL UNIQUE,
      "min_length" integer,
      "max_length" integer,
	    "param_type" VARCHAR(20) NOT NULL,
	    "display_label" VARCHAR(100),
      "help_text" VARCHAR(200),
      "valid_possible_values" VARCHAR(200),
	    "optional_field" boolean
    );`;

const user = `
  CREATE TABLE IF NOT EXISTS "user_details" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL
  );`;
pool.query(state_machine);
pool.query(state_machine_routing);
pool.query(state_machine_parameters);
pool.query(user);

export const query = async (text: string, params: any[]) => {
  // const start = Date.now();
  const res = await pool.query(text, params);
  // const duration = Date.now() - start;
  // console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
