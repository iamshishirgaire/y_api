import postgres from "postgres";
import chalk from "chalk";
import ora from "ora";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import Users from "../generated/public/Users";

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
      id: uuidv4(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      bio: faker.lorem.paragraph(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      country: faker.address.country(),
      dob: faker.date.past(30, new Date("2000-01-01")),
      profilePicture: faker.internet.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const seedUsers = `
    INSERT INTO users (
      id, username, password, email, bio, firstName, lastName, country, dob, profilePicture, createdAt, updatedAt
    ) VALUES
    ${users
      .map(
        (user) => `(
          '${user.id}', '${user.username}', '${user.password}', '${
          user.email
        }', '${user.bio}', '${user.firstName}', '${user.lastName}', '${
          user.country
        }', '${user.dob.toISOString()}', '${
          user.profilePicture
        }', '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}'
        )`
      )
      .join(", ")}
    ON CONFLICT DO NOTHING;
  `;

  await sql.unsafe(seedUsers);

  let Ids = await sql<
    {
      id: string;
    }[]
  >`SELECT id FROM users;`;
  let userIds = Ids.map((row) => row.id);

  const tweets = [];
  for (let i = 0; i < 10; i++) {
    tweets.push({
      id: uuidv4(),
      content: faker.lorem.paragraph(),
      mediaUrl: Array.from({ length: Math.floor(Math.random() * 3) }, () =>
        faker.internet.url()
      ),
      createdAt: new Date(),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      visibility: faker.helpers.arrayElement(["public", "private"]),
    });
  }

  const seedTweets = `
    INSERT INTO tweets (
      id, content, mediaUrl, createdAt, userId, visibility
    ) VALUES
    ${tweets
      .map(
        (tweet) => `(
          '${tweet.id}', '${tweet.content}', '{${tweet.mediaUrl.join(
          ","
        )}}', '${tweet.createdAt.toISOString()}', '${tweet.userId}', '${
          tweet.visibility
        }'
        )`
      )
      .join(", ")}
    ON CONFLICT DO NOTHING;
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

    await sql.unsafe(seedTweets);
    spinner.succeed(chalk.green("Database seeded successfully."));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to seed the database: ${error}`));
  } finally {
    await sql.end();
    console.log(chalk.blue("Disconnected from the database."));
  }
};

seedDatabase();
