import mongoose from "mongoose";
import { User } from "../user/user.entity";
import { UserModel } from "../user/user.model";
import { task_entity as Todo } from "./todo.entity";
import { TodoModel } from "./todo.model";
import { UtenteNonTrovatoError } from "../../errors/user_not_found";

export class TodoService {
  async show_todo(
    userId: string,
    options?: { completed?: boolean }
  ): Promise<Todo[]> {
    console.log("user", userId);
    // Costruisci il filtro per includere il campo "completed" se specificato nelle opzioni
    const filter: any = { createdBy: userId };

    // Controlla se options è definito e se options.completed è true o false
    if (options?.completed !== undefined) {
      // Se options.completed è false, aggiungi il filtro per mostrare solo i todo non completati
      if (!options.completed) {
        filter.completed = false;
      }
    } else {
      // Se options.completed non è specificato, mostra solo i todo non completati
      filter.completed = false;
    }
    console.log("filter", filter, "userId", userId, "options", options);

    // Utilizza il modello TodoModel per cercare i todo associati all'utente specificato
    const todos = await TodoModel.find(filter)
      .populate("createdBy")
      .populate("assignedTo");
    return todos; // Restituisce i todo trovati
  }

  //Partial è un tipo di TypeScript che crea un nuovo tipo con tutti i campi di un altro tipo impostati come obbligatori.
  async add_todo(TodoObject, userId): Promise<Todo> {
    const newTodo = await TodoModel.create({
      ...TodoObject,
      createdBy: userId, // Assegna direttamente l'ID dell'utente
      assignedTo: TodoObject.assignedTo, // Assicurati che TodoObject contenga già l'ID dell'utente assegnato
    });
    newTodo.populate("createdBy assignedTo");
    return newTodo.populate("createdBy assignedTo"); // Esegui popolazione e restituisci il risultato
  }

  async check_todo(todoId: string, userId: string) {
    const todo = await TodoModel.findById(todoId);

    if (!todo) throw new Error("Todo non trovato");

    if (todo?.createdBy.toString() === userId) todo.completed = true;
    else throw new Error("Non hai accesso a questo todo");

    if (!mongoose.Types.ObjectId.isValid(todoId))
      throw new Error("L'id che hai inserito non è valido");

    const isTodo = await TodoModel.findById(todoId);
    if (!isTodo) throw new Error("Il todo non esiste");

    await todo.save();

    return todo;
  }

  async uncheck_todo(todoId: string, userId: string) {
    const todo = await TodoModel.findById(todoId);

    if (!todo) throw new Error("Todo non trovato");

    if (todo?.createdBy.toString() === userId) todo.completed = false;
    else throw new Error("Non hai accesso a questo todo");

    if (!mongoose.Types.ObjectId.isValid(todoId))
      throw new Error("L'id che hai inserito non è valido");

    const isTodo = await TodoModel.findById(todoId);
    if (!isTodo) throw new Error("Il todo non esiste");

    await todo.save();

    return todo;
  }
  async assign_todo(
    id: string,
    assignedTo: mongoose.Types.ObjectId,
    userId: string
  ) {
    // Trova il todo con l'id specificato
    const todo = await TodoModel.findById(id);
    // Se il todo non è stato trovato, restituisci un errore 404
    if (!todo) throw new Error("Todo non trovato");
    // Verifica se l'id dell'utente assegnato è valido
    const isValidObjectId = mongoose.Types.ObjectId.isValid(assignedTo);
    if (!isValidObjectId) throw new Error("L'id che hai inserito non è valido");

    const assignedToUser = await UserModel.findById(assignedTo);
    // Verifica se l'utente assegnato esiste
    if (!assignedToUser) throw new UtenteNonTrovatoError();
    const isTodo = await TodoModel.findById(id);
    // Verifica se il todo esiste
    if (!isTodo) throw new Error("Il todo non esiste");
    // Verifica se l'utente che ha creato il todo è lo stesso che sta cercando di assegnarlo
    if (todo.createdBy.toString() === userId) todo.assignedTo = assignedToUser;
    else throw new Error("Non hai accesso a questo todo");
    // Salva il todo aggiornato
    await todo.save();

    return todo.populate("createdBy assignedTo");
  }
}

export default new TodoService();

//Crea una nuova classe di errore, la lancio nel servizio (new not_found_error) e la gestisco nel catch
