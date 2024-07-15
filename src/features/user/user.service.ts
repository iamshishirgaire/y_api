import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db";
import type Users from "../../../generated/public/Users";
import type { GoogleTokenResponse } from "../auth/auth.types";
import type { UpdateUserInput } from "./user.schema";

export class UserService {
  public async findByEmail(email: string) {
    const usr = await db<
      Users[]
    >`select  * from users where users.email = ${email} limit 1`;
    return usr[0];
  }
  public async findByUserName(user_name: string) {
    const usr = await db<
      Users[]
    >`select  * from users where users.user_name = ${user_name} limit 1`;
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
      user_name: faker.internet.userName(),
      first_name: response.given_name,
      last_name: response.family_name,
      profile_picture: response.picture,
      email: response.email,
      following: 0,
      followers: 0,
    };
    const usr = await db`insert into users ${db(user)}`;
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  }

  public async update(parsedData: UpdateUserInput): Promise<void> {
    try {
      const { id, ...rest } = parsedData;
      const updateData = {
        ...rest,
        updated_at: new Date(),
      };
      await db`update users set ${db(updateData)} where users.id = ${id}`;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  public async delete(id: string): Promise<void> {
    await db`delete from users where users.id = ${id}`;
  }
}
