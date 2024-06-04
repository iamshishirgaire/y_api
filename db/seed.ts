import postgres from "postgres";
import chalk from "chalk";
import ora from "ora";
import { faker } from "@faker-js/faker";
const seedDatabase = async () => {
  const sql = postgres(process.env.DATABASE_URL as string);
  console.log(chalk.green("Connected to the database."));

  const spinner = ora({
    text: "Seeding database...",
    spinner: "dots",
  }).start();

  // Generate fake users data
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    });
  }
  const seedUsers = `
    INSERT INTO users (username, password, email) VALUES
    ${users
      .map(
        (user) => `('${user.username}', '${user.password}', '${user.email}')`
      )
      .join(", ")}
    ON CONFLICT DO NOTHING; -- Prevents duplicate entries if the script is run multiple times
  `;

  await sql.unsafe(seedUsers);

  let userIds = await sql`SELECT id FROM users;`;
  const post = [];
  for (let i = 0; i < 10; i++) {
    post.push({
      title: faker.lorem.words(),
      content: faker.lorem.paragraph(),
      user_id: userIds[Math.floor(Math.random() * userIds.length)].id,
    });
  }

  // Build the insert query with the generated fake users

  const seedPosts = `
    INSERT INTO posts (title, content, user_id) VALUES
    ${post
      .map((post) => `('${post.title}', '${post.content}', '${post.user_id}')`)
      .join(", ")}
    ON CONFLICT DO NOTHING; -- Prevents duplicate entries if the script is run multiple times
  `;

  try {
    // Check if the users table exists
    const tableCheck = await sql`
      SELECT to_regclass('public.users') AS table_exists;
    `;

    if (!tableCheck[0].table_exists) {
      throw new Error(
        "The table 'users' does not exist. Please create the table before seeding."
      );
    }

    await sql.unsafe(seedPosts);
    spinner.succeed(chalk.green("Database seeded successfully."));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to seed the database: ${error}`));
  } finally {
    await sql.end();
    console.log(chalk.blue("Disconnected from the database."));
  }
};

seedDatabase();
