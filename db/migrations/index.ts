import { file as bunFile } from "bun";
import postgres from "postgres";
import chalk from "chalk";
import ora from "ora";

const runMigration = async (filename: string) => {
  const sql = postgres(process.env.DATABASE_URL as string);
  console.log(chalk.green("Connected to the database."));

  const spinner = ora({
    text: "Running migration...",
    spinner: "dots",
  }).start();

  try {
    const file = bunFile(`db/migrations/${filename}.sql`);
    if (!file) {
      throw new Error("File not found");
    }

    const query = await file.text();
    if (!query) {
      throw new Error("Empty file");
    }

    await sql.unsafe(query);

    spinner.succeed(
      chalk.green(`Migration from file ${filename} executed successfully.`)
    );
  } catch (error) {
    spinner.fail(chalk.red(`Failed to execute migration: ${error}`));
  } finally {
    await sql.end();
    console.log(chalk.blue("Disconnected from the database."));
  }
};

// Get the filename from command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(
    chalk.red("Please provide the migration file name as an argument.")
  );
  process.exit(1);
}

const filename = args[0];
runMigration(filename);
