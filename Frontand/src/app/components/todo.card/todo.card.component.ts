import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../entity/todo.entity';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo.card.component.html',
  styleUrls: ['./todo.card.component.css'],
})
export class TodoCardComponent implements OnInit {
  @Input() todos: Todo[] = []; // Dichiarazione della proprietà 'todos' come input con inizializzazione

  ngOnInit(): void {
    console.log('Lista dei todo:', this.todos);
  }

  description = false; // Dichiarazione della proprietà 'description' con inizializzazione
}
