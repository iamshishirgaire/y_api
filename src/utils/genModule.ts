import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const generateModule = async (moduleName: string) => {
  const spinner = ora({
    text: `Generating ${moduleName} module...`,
    spinner: "dots",
  }).start();

  try {
    const baseDir = path.join("src/features", moduleName);
    await fs.mkdir(baseDir, { recursive: true });

    // Define the file paths
    const controllerPath = path.join(baseDir, `${moduleName}.controller.ts`);
    const schemaPath = path.join(baseDir, `${moduleName}.schema.ts`);
    const servicesPath = path.join(baseDir, `${moduleName}.service.ts`);
    const routesPath = "src/app.ts";

    // Define the content for each file
    const controllerContent = `
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ${decapitalize(moduleName)}Schema } from "./${decapitalize(
      moduleName
    )}.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const ${decapitalize(moduleName)}Route = new Hono();

${decapitalize(moduleName)}Route
  .get("/",zValidator("param",${decapitalize(
    moduleName
  )}Schema,onErrorMsg) ,(c) => {
    return c.json({
      message: "${moduleName} GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "${moduleName} POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "${moduleName} PATCH ROUTE",
    });
  });

`;

    const schemaContent = `import { z } from 'zod';

export const ${decapitalize(moduleName)}Schema = z.object({
  id: z.string(),
 
});
`;

    const servicesContent = `export class ${capitalize(moduleName)}Service {
  public async findAll(): Promise<void> {
    // Your logic here
  }

  public async findOne(): Promise<void> {
    // Your logic here
  }

  public async create(): Promise<void> {
    // Your logic here
  }

  public async update(): Promise<void> {
    // Your logic here
  }

  public async delete(): Promise<void> {
    // Your logic here
  }
}
`;

    // Read the existing content of the app.ts file
    let routesContent = await fs.readFile(routesPath, "utf-8");

    // Find the import section in the routes.ts file
    const importIndex = routesContent.indexOf("//handlers");

    if (importIndex === -1) {
      throw new Error('Missing "//handlers" comment in routes.ts file');
    }

    // Define import statement and route assignment
    const importStatement = `import { ${decapitalize(
      moduleName
    )}Route } from "./features/${decapitalize(moduleName)}/${decapitalize(
      moduleName
    )}.controller";`;
    const routeAssignment = `app.route("/${decapitalize(
      moduleName
    )}", ${decapitalize(moduleName)}Route);`;

    // Append import statement and route assignment to the routes.ts file content
    const updatedRoutesContent =
      routesContent.slice(0, importIndex).trim() +
      "\n" +
      importStatement +
      "\n" +
      routesContent.slice(importIndex).trim();

    // Find the closing brace of the routes function
    const closingBraceIndex = updatedRoutesContent.lastIndexOf("}");

    const finalRoutesContent =
      updatedRoutesContent.slice(0, closingBraceIndex).trim() +
      "\n  " + // Indent the route assignment correctly
      routeAssignment +
      "\n" +
      updatedRoutesContent.slice(closingBraceIndex).trim() +
      "\n";

    // Write the files
    await Promise.all([
      fs.writeFile(controllerPath, controllerContent),
      fs.writeFile(schemaPath, schemaContent),
      fs.writeFile(servicesPath, servicesContent),
      fs.writeFile(routesPath, finalRoutesContent),
    ]);

    spinner.succeed(
      chalk.green(`${moduleName} module generated successfully.`)
    );
  } catch (error) {
    spinner.fail(
      chalk.red(`Failed to generate ${moduleName} module: ${error}`)
    );
  }
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const decapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

// Get the module name from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    chalk.red(
      "Error: Module name is required. Usage: bun generateModule.ts <moduleName>"
    )
  );
  process.exit(1);
}

const moduleName = args[0];
generateModule(moduleName);
