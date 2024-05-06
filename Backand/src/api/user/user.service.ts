import { UserExistsError } from "../../errors/user-exists";
import { UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from "bcrypt";

export class UserService {
  async add(
    user: User,
    credentials: { username: string; password: string }
  ): Promise<User> {
    const existingIdentity = await UserIdentityModel.findOne({
      "credentials.username": credentials.username,
    });
    if (existingIdentity) {
      throw new UserExistsError();
    }

    const existingUser = await UserModel.findOne({
      firstName: user.firstName,
      lastName: user.lastName,
    });
    if (existingUser) {
      throw new Error("Esiste già un utente con lo stesso nome e cognome.");
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await UserModel.create(user);
    await UserIdentityModel.create({
      provider: "local",
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return newUser;
  }

  async show_all_users(userId: string): Promise<User[]> {
    const isAuthenticated = await UserModel.findById(userId);
    if (!isAuthenticated) throw new Error("Utente non autenticato");
    const users = await UserModel.find();
    return users;
  }

  async find_user_by_fullName(
    userId: string,
    firstName: string,
    lastName: string
  ) {
    // Cerca l'utente per ID
    const isAuthenticated = await UserModel.findById(userId);
    if (!isAuthenticated) {
      throw new Error("Utente non autenticato");
    }

    // Trova l'utente con lo stesso nome e cognome
    const user = await UserModel.findOne({ firstName, lastName });

    if (!user) {
      throw new Error("Utente non trovato");
    }

    return user;
  }
}

export default new UserService();
