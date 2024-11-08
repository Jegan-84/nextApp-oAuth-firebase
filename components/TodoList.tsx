import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  Todo,
} from "../lib/todoUtils";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TodoList() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    if (user) {
      const fetchedTodos = await getTodos(user.uid);
      setTodos(fetchedTodos);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newTodo.trim()) {
      await addTodo(user.uid, newTodo.trim());
      setNewTodo("");
      fetchTodos();
    }
  };

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    await updateTodo(id, completed);
    fetchTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    fetchTodos();
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      <form onSubmit={handleAddTodo}>
        <TextField
          fullWidth
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Todo
        </Button>
      </form>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} dense button>
            <Checkbox
              edge="start"
              checked={todo.completed}
              onChange={() => handleUpdateTodo(todo.id, !todo.completed)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={todo.title}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
