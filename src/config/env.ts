import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING as string,
  PORT: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
};
export default config;
