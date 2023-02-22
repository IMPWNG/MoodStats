import { supabase } from "../../lib/initSupabase";
import bodyParser from "body-parser";

const jsonParser = bodyParser.json();

const fetchTodos = async () => {
  let { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .order("id", true);
  if (error) {
    throw new Error(error.message);
  }
  return todos;
};

const handleAddTodo = async (task, category, rating, user_id) => {
  const taskText = task.trim();
  const categoryText = category.trim();
  if (taskText.length === 0) {
    throw new Error("Task cannot be empty");
  }
  if (category.length === 0) {
    throw new Error("Category cannot be empty");
  }
  if (!rating || rating < 1 || rating > 10) {
    throw new Error("Please rate your mood");
  }
  const { data: todo, error } = await supabase
    .from("todos")
    .insert({ task: taskText, rating, user_id, category: categoryText })
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return todo;
};

const deleteTodo = async (id) => {
  try {
    await supabase.from("todos").delete().eq("id", id);
    setTodos(todos.filter((x) => x.id != id));
  } catch (error) {
    console.log("error", error);
  }
};

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ is_complete: !isCompleted })
        .eq("id", todo.id)
        .single();
      if (error) {
        throw new Error(error);
      }
      setIsCompleted(data.is_complete);
    } catch (error) {
      console.log("error", error);
    }
  };

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const todos = await fetchTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { task, category, rating, user_id } = req.body;
      const todo = await handleAddTodo(task, category, rating, user_id);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await deleteTodo(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.body;
      const todo = await fetchTodoById(id);
      await toggle(todo);
      res.status(200).json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}



