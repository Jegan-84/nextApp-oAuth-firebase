import TodoList from "../components/TodoList";
import { withAuth } from "../components/withAuth";

function Todos() {
  return <TodoList />;
}

export default withAuth(Todos);
