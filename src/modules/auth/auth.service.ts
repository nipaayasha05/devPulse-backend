import config from "../../config/env";
import { pool } from "../../db";
import type { LoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const logInUserIntoDB = async (payload: LoginUser) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const userInfo = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, userInfo.password);

  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  //   generate token
  const jwtpayload = {
    id: userInfo.id,
    name: userInfo.name,
    role: userInfo.role,
    email: userInfo.email,
  };

  const user = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
    created_at: userInfo.created_at,
    updated_at: userInfo.updated_at,
  };

  const token = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });
  return { token, user };
};

export const authService = {
  logInUserIntoDB,
};
