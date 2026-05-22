import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
import globalErrorHandle from "./utils/globalErrorHandle";
import cors from "cors";

const app: Application = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://assignment-2-five-gold.vercel.app/",
    ],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!", author: "express" });
});

app.use("/api/auth", userRoute);

app.use("/api/auth", authRoute);

app.use("/api/issues", issueRoute);

app.use(globalErrorHandle);

export default app;
