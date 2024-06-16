import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db";
import type Users from "../../../generated/public/Users";
import type { GoogleTokenResponse } from "../auth/auth.types";
import type { UpdateUserInput, } from "./user.schema";


export class UserService {


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

  public async update(parsedData: UpdateUserInput): Promise<void> {
    const id = parsedData.id;
    const fields = Object.keys(parsedData);
    const values = Object.values(parsedData);

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    const query = `UPDATE users SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1}`;

    try {
      await db.unsafe(query, [...values, id]);
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    await db`delete from users where users.id = ${id}`;
  }
}
