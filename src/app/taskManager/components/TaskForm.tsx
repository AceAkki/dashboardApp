import { Form } from "react-router-dom";
const TaskForm = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  return (
    <Form method="post">
      <input
        type="text"
        name="task"
        placeholder="Add a New Task"
        required
        ref={inputRef}
      />
      <button type="submit">+</button>
    </Form>
  );
};

export default TaskForm;
