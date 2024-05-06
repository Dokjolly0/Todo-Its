import { User } from './user.entity';

export interface Todo {
  id?: string;
  title: string;
  dueDate?: Date;
  completed?: Boolean;
  expired?: Boolean;
  createdBy: User;
  assignedTo?: User;
}
