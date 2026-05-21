import { pool } from "../../db";
import type { User } from "./user.interface";
import bcrypt from "bcrypt";

const createUserIntoDb = async (payload: User) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,COALESCE($4,'contributor'))
    RETURNING *
    `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const getAllIssuFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues
    SELECT * FROM users WHERE id=$1 IN (SELECT reporter_id FROM issues)
    `,
    [id],
  );
  return result.rows;
};

export const userService = {
  createUserIntoDb,
  getAllIssuFromDB,
};
