import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TodoService } from '../../services/todo.service';
import { User } from '../../entity/user.entity';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css',
})
export class AddTodoComponent implements OnInit {
  availableUsers: string[] = [];
  token = localStorage.getItem('token');
  user = localStorage.getItem('user');

  todo: any = {
    title: '',
    description: '',
    dueDate: '',
    createBy: JSON.parse(this.user!),
    assignedTo: '',
  };

  @Output() formSubmitted = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private todoService: TodoService
  ) {} // Inietta il servizio TodoService nel costruttore

  ngOnInit(): void {
    this.getUserList(); // Chiama il metodo per ottenere la lista degli utenti disponibili
  }

  getUserList(): void {
    if (!this.token) {
      console.error('Nessun token disponibile.');
      return; // Esci dalla funzione se il token non è presente
    }

    this.userService.getUserList(this.token).subscribe(
      (response: any) => {
        if (!response || !response.users) {
          console.log(
            'La risposta non contiene la lista degli utenti:',
            response
          );
          // Estrai la proprietà fullName da ciascun oggetto e crea un array con i nomi completi
          this.availableUsers = response.map((user: any) => user.fullName);
          //esci dalla funzione se la risposta non contiene la lista degli utenti
          return;
        }
        this.availableUsers = response.users;
        // Estrai la proprietà fullName da ciascun oggetto e crea un array con i nomi completi
        this.availableUsers = response.map((user: any) => user.fullName);
        // console.log('Lista degli utenti:', this.availableUsers);
      },
      (error: any) => {
        console.error(
          'Errore durante il recupero della lista degli utenti:',
          error
        );
      }
    );
  }

  onSubmit() {
    const title = (document.querySelector('#title') as HTMLInputElement).value;
    if (!title) {
      alert('Il titolo è obbligatorio.');
      return;
    }

    let dueDate = (document.querySelector('#dueDate') as HTMLInputElement)
      .value;
    if (!dueDate) this.todo.dueDate = undefined;
    else this.todo.dueDate = dueDate;

    let description = (
      document.querySelector('#description') as HTMLInputElement
    ).value;
    if (!description) this.todo.description = undefined;
    else this.todo.description = description;

    const fullName_assignedTo = (
      document.querySelector('#assignedTo') as HTMLSelectElement
    ).value;
    if (fullName_assignedTo) {
      this.todoService
        .findUserByFullName(this.token!, fullName_assignedTo)
        .subscribe(
          (user: any) => {
            this.todo.assignedTo = user.id;
            // console.log(`Valore assignTo: ${this.todo.assignedTo}`);
            // console.log('Todo trovato:', this.todo);
            this.saveTodo(); // Ora, dopo aver ottenuto l'ID dell'utente, possiamo salvare il todo
          },
          (error: any) => {
            this.todo.assignedTo = undefined;
            console.log('Non hai scelto nessun utente');
          }
        );
    } else {
      console.log('Non hai scelto nessun utente');
      return;
    }
  }

  saveTodo() {
    // Aggiunta del todo
    this.todoService.addTodo(this.token!, this.todo).subscribe(
      (response: any) => {
        console.log('Todo aggiunto:', response);
        this.formSubmitted.emit();
      },
      (error: any) => {
        console.error("Errore durante l'aggiunta del todo:", error);
        console.log('Todo con errore:', this.todo);
      }
    );
  }
}
