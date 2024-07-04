import postgres, { type PostgresError } from "postgres";
import { file as bunFile } from "bun";
import chalk from "chalk";
import ora from "ora";
import { readdir } from "node:fs/promises";
import Table from "cli-table";

interface MigrationResult {
  filename: string;
  status: string;
  message: string;
}

const runMigration = async (filename: string, results?: MigrationResult[]) => {
  const sql = postgres(process.env.DATABASE_URL as string);
  const spinner = ora({
    text: `Running migration: ${filename}`,
    spinner: "dots",
  }).start();

  try {
    const file = bunFile(`db/migrations/${filename}.sql`);
    const query = await file.text();
    if (!query) {
      throw new Error("Empty file");
    }

    await sql.unsafe(query);

    spinner.succeed(
      chalk.green(`Migration from file ${filename} executed successfully.`)
    );

    results?.push({
      filename,
      status: "Success",
      message: "Executed successfully",
    });
  } catch (error) {
    if (
      (error as PostgresError).code === "42P07" ||
      (error as PostgresError).code === "42710"
    ) {
      spinner.warn(
        chalk.yellow(`Object already exists, skipping migration: ${filename}`)
      );

      results?.push({
        filename,
        status: "Skipped",
        message: "Object already exists",
      });
    } else {
      spinner.fail(
        chalk.red(`Failed to execute migration: ${(error as Error)?.message}`)
      );
      results?.push({
        filename,
        status: "Failed",
        message: (error as Error)?.message || "Unknown error",
      });
    }
  } finally {
    await sql.end();
  }
};

const runAllMigrations = async () => {
  const sql = postgres(process.env.DATABASE_URL as string);
  console.log(chalk.green("Connected to the database."));

  const spinner = ora({
    text: "Running migrations...",
    spinner: "dots",
  }).start();

  const results: MigrationResult[] = [];

  try {
    const files = await readdir("db/migrations");
    const sqlFiles = files.filter((file: string) => file.endsWith(".sql"));

    for (const file of sqlFiles) {
      const filename = file.split(".")[0];
      spinner.text = `Running migration: ${filename}`;
      await runMigration(filename, results);
    }

    spinner.succeed(chalk.green("All migrations executed successfully."));
  } catch (error) {
    spinner.fail(
      chalk.red(`Failed to execute migrations: ${(error as Error).message}`)
    );
  } finally {
    await sql.end();
    displayResults(results);
  }
};

const displayResults = (results: MigrationResult[]) => {
  const table = new Table({
    head: ["Filename", "Status", "Message"],
    colWidths: [30, 15, 50],
  });

  for (const result of results) {
    table.push([result.filename, result.status, result.message]);
  }

  console.log(table.toString());
};

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(
    chalk.red(
      "Please provide the migration file name or 'all' to run all migrations as an argument."
    )
  );
  process.exit(1);
}

const argument = args[0];
if (argument === "all") {
  runAllMigrations();
} else {
  const results: MigrationResult[] = [];
  runMigration(argument, results).then(() => displayResults(results));
}
