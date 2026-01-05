import "dotenv/config";
import express, { Application } from "express";
import reposRoutes from "./routes/repos.route";
import { swaggerUi, swaggerSpec } from "./swagger";
import { errorHandler } from "./utils/errors/error-handler.middleware";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());

app.use("/repos", reposRoutes);
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
