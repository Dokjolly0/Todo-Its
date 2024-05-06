import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import userService from "./user.service";

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user!);
};

export const show_all_users = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const users = await userService.show_all_users(user.id!);
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export const find_user_by_fullName = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const fullName: string = req.query.fullName as string; // Assicurati che fullName sia di tipo stringa
    const spaceIndex = fullName.indexOf(" ");
    const firstName =
      spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
    const lastName =
      spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : "";

    const users = await userService.find_user_by_fullName(
      user.id!,
      firstName,
      lastName
    );
    res.json(users);
  } catch (e) {
    next(e);
  }
};
