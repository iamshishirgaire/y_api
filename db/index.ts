import ora from "ora";
import postgres from "postgres";
import env from "../src/utils/envVariables";

export async function testDbClient() {
  const spinner = ora({
    text: "Connecting to Database...",
    spinner: "dots",
  }).start();

  try {
    await db`SELECT 1`;
    spinner.succeed("Database Connected");
    return;
  } catch (error) {
    spinner.fail("Failed to connect to the database");
    throw error;
  }
}
const dbClient = async () => {
  const pg = postgres(env.DATABASE_URL);
  await pg`SELECT 1`;
  return pg;
};

const db = await dbClient();
export default db;
