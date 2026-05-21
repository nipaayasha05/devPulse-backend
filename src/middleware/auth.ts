import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token as string,
      config.secret as string,
    ) as JwtPayload;

    // console.log(decoded);

    const userData = await pool.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [decoded.email as string],
    );

    const user = userData.rows[0];

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Unauthorized user",
      });
    }

    req.user = decoded;

    next();
  };
};
export default auth;
