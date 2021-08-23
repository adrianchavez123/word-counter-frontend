import { assignmentActions as actions } from ".";

export function handleAssignmentSubmit(e, state, dispatch) {
  e.preventDefault();
  const assignment = {
    due_date: state.assignment.dueDate,
    exercise_id: state.assignment.exercise.id,
    group_id: state.assignment.group.id,
  };
  let fetched = null;
  if (state.action === "CREATE") {
    fetched = fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignment),
    });
  } else if (state.action === "MODIFY") {
    fetched = fetch(
      `http://localhost:5000/api/assignments/${state.assignment.assignment_id}`,
      {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
      }
    );
  } else {
    return;
  }
  fetched
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      const newAssignment = {
        ...state.assignment,
        assignment_id:
          state.action === "CREATE"
            ? data.assignment.assignment_id
            : state.assignment.assignment_i,
        group: {
          group_id: state.assignment.group.id,
          group_name: state.assignment.group.text,
        },
        exercise: {
          exercise_id: state.assignment.exercise.id,
          title: state.assignment.exercise.text,
        },
        due_date: new Date(assignment.due_date).toISOString(),
      };

      if (state.action === "CREATE") {
        dispatch({
          type: actions.setAssignments,
          payload: {
            assignments: [...state.assignments, newAssignment],
          },
        });
      }

      if (state.action === "MODIFY") {
        const assignments = state.assignments.filter(
          (assignment) =>
            assignment.assignment_id !== state.assignment.assignment_id
        );
        dispatch({
          type: actions.setAssignments,
          payload: {
            assignments: [...assignments, newAssignment],
          },
        });
      }

      dispatch({
        type: actions.setAssignment,
        payload: {
          assignment: {
            assignment_id: null,
            group: { id: "", text: "" },
            dueDate: "",
            exercise: { id: "", text: "" },
          },
        },
      });
      dispatch({
        type: actions.openAssignmentModal,
        payload: { openAssignment: false },
      });
    })
    .catch((error) => console.log(error));
}
