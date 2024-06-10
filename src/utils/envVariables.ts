import z from "zod";
const envSchema = z.object({
  NODE_ENV: z.string({ message: "NODE_ENV must be a string" }),
  PORT: z.string().optional(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:", result.error.errors);
  process.exit(1);
}
const env = result.data;
export default env;
