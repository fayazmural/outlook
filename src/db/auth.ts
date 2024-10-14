import { esClient } from "../config/elasticsearchConfig.js";
import { userSchema } from "../schema/user.js";
import { User } from "../types/user.js";
import { hashPassword } from "../utils/password.js";
import { v4 as uuidv4 } from "uuid";

const USER_INDEX = "users";

/**
 * Represents a user authentication manager for handling authentication-related operations.
 */
export class UserAuthenticationManager {
  private static instance: UserAuthenticationManager;

  /**
   * Gets the singleton instance of the UserAuthenticationManager.
   * @returns The singleton instance of UserAuthenticationManager
   */
  static getInstance(): UserAuthenticationManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserAuthenticationManager();
    return this.instance;
  }

  /**
   * Validates a user against a predefined schema.
   * @param user - The user to be validated.
   * @returns A promise that resolves with the validated user if the validation is successful.
   */
  async validateUser(user: User): Promise<User> {
    const validatedUser = userSchema.parse(user);
    return validatedUser;
  }

  /**
   * Creates a new user and adds it to the database
   * @param user - The new user to be created.
   * @returns A promise that resolves with the created user if the creation is successful.
   */
  async createUser(user: User): Promise<Omit<User, "password">> {
    const id = uuidv4();
    user.id = id;
    user.password = await hashPassword(user.password);
    await esClient.index({
      index: USER_INDEX,
      id,
      body: user,
    });

    const createdUser = {
      id: user.id,
      email: user.email,
    };

    return createdUser;
  }

  /**
   * Retrieves a user by their email address from Elasticsearch.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with the user if found, or undefined if not found.
   */
  async getUser(email: string): Promise<User | undefined> {
    const body = await esClient.search({
      index: USER_INDEX,
      query: {
        term: {
          "email.keyword": email,
        },
      },
    });
    const user = body.hits.hits[0]?._source as User;
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const body = await esClient.search({
      index: USER_INDEX,
      query: {
        term: {
          "id.keyword": id,
        },
      },
    });
    const user = body.hits.hits[0]?._source as User;
    return user || undefined;
  }
}
