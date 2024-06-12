import { faker } from "@faker-js/faker";
import db from "../../../db";
import type Users from "../../../generated/public/Users";
import type { GoogleTokenResponse } from "../auth/auth.types";
import { v4 as uuidv4 } from "uuid";
export class UserService {
  public async findAll(): Promise<void> {
    // Your logic here
  }

  public async findByEmail(email: string) {
    const usr = await db<
      {
        id: string;
        email: string;
      }[]
    >`select  id,email from users where users.email = ${email} limit 1`;
    return usr[0];
  }
  public async findById(userId: string) {
    const usr = await db<
      Users[]
    >`select  * from users where users.id = ${userId} limit 1`;
    return usr[0];
  }

  public async create(response: GoogleTokenResponse) {
    const id = uuidv4();
    const user = {
      id: id,
      userName: faker.internet.userName(),
      firstName: response.given_name,
      lastName: response.family_name,
      profilePicture: response.picture,
      email: response.email,
      created_at: new Date(),
      updated_at: new Date(),
      following: 0,
      followers: 0,
    };
    const usr = await db`insert into users ${db(user)}`;
    if (!user) {
      throw new Error("Failed to create user");
    }
    console.log(usr);
    return user;
  }

  public async update(): Promise<void> {
    // Your logic here
  }

  public async delete(): Promise<void> {
    // Your logic here
  }
}
