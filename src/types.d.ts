export interface Todo {
  id: number
  date: string
  title: string
  isCompleted: boolean
  isPriority: boolean
}

export type NewTodoEntry = Omit<Todo, 'id', 'isCompleted'>
