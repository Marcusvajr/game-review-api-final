import { app } from "./app";
import { env } from "../../config/env";

const PORT = Number(process.env.PORT) || env.port;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
