import postgres from "postgres";
import chalk from "chalk";
import ora from "ora";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

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
      email: faker.internet.email(),
      bio: faker.lorem.paragraph(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      country: faker.location.country(),
      dob: faker.date.past(30, new Date("2000-01-01")),
      profile_picture: faker.image.avatar(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const seedUsers = `
    INSERT INTO users (
      id, username, email, bio, first_name, last_name, country, dob, profile_picture, created_at, updated_at
    ) VALUES
    ${users
      .map(
        (user) => `(
          '${user.id}', '${user.username}', '${user.email}', '${user.bio}', '${
          user.first_name
        }', '${user.last_name}', '${
          user.country
        }', '${user.dob.toISOString()}', '${
          user.profile_picture
        }', '${user.created_at.toISOString()}', '${user.updated_at.toISOString()}'
        )`
      )
      .join(", ")}
    ON CONFLICT DO NOTHING;
  `;

  await sql.unsafe(seedUsers);

  const Ids = await sql<
    {
      id: string;
    }[]
  >`SELECT id FROM users;`;
  const userIds = Ids.map((row) => row.id);

  const tweets = [];
  for (let i = 0; i < 10; i++) {
    tweets.push({
      id: uuidv4(),
      content: faker.lorem.paragraph(),
      media_url: Array.from({ length: Math.floor(Math.random() * 3) }, () =>
        faker.internet.url()
      ),
      created_at: new Date(),
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      visibility: faker.helpers.arrayElement(["public", "private"]),
    });
  }

  const seedTweets = `
    INSERT INTO tweets (
      id, content, media_url, created_at, user_id, visibility
    ) VALUES
    ${tweets
      .map(
        (tweet) => `(
          '${tweet.id}', '${tweet.content}', '{${tweet.media_url.join(
          ","
        )}}', '${tweet.created_at.toISOString()}', '${tweet.user_id}', '${
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
