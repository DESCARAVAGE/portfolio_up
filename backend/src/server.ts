import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);

  console.log(`Dl my cv from this route : http://localhost:${env.port}${env.routes.cvDownload}`);
});