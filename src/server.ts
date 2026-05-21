import app from "./app";
import config from "./config/env";

export const main = () => {
  if (process.env.NODE_ENV != "production") {
    app.listen(config.PORT, () => {
      console.log(`Example app listening on port ${config.PORT}`);
    });
  }
};

main();

export default app;
