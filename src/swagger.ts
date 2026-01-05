import * as path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerSpec = YAML.load(path.join(process.cwd(), "swagger.yml"));

export { swaggerSpec, swaggerUi };
