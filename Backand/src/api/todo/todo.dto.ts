//npm install class-transformer //npm install class-validator
import {
  IsInt,
  IsMongoId,
  Min,
  IsString,
  IsDate,
  IsOptional,
  IsDateString,
} from "class-validator";
import mongoose from "mongoose";
import { isMongoId } from "validator";

export class Add_todo_dto {
  @IsString()
  title: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsMongoId()
  @IsOptional()
  assignedTo: mongoose.Types.ObjectId;
}
