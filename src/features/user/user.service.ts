import { faker } from "@faker-js/faker";
import db from "../../../db";
import Users from "../../../generated/public/Users";
import { GoogleTokenResponse } from "../auth/auth.types";
import { v4 as uuidv4 } from "uuid";
export class UserService {
  public async findAll(): Promise<void> {
    // Your logic here
  }

  public async findByEmail(email: string) {
    try {
      const usr = await db<
        {
          id: string;
          email: string;
        }[]
      >`select  id,email from users where users.email = ${email} limit 1`;
      return usr;
    } catch (error) {
      throw error;
    }
    // Your logic here
  }

  public async create(response: GoogleTokenResponse) {
    try {
      let id = uuidv4();
      let user = {
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
      let usr = await db`insert into users ${db(user)}`;
      if (!user) {
        throw new Error("Failed to create user");
      }
      console.log(usr);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async update(): Promise<void> {
    // Your logic here
  }

  public async delete(): Promise<void> {
    // Your logic here
  }
}
