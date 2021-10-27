import { groupActions } from ".";

export async function handleSubmitGroup(e, state, dispatch, professor_id) {
  e.preventDefault();
  const group = {
    name: state.group.name,
    students: state.group.students,
    professor_id: professor_id,
    token: state.group.token,
  };
  let results = null;
  if (state.action === "MODIFY") {
    results = await fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/groups/${state.group.group_id}`,
      {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      }
    );
  } else {
    return;
  }
  const data = await results.json();

  if (data) {
    dispatch({
      type: groupActions.openGroupModal,
      payload: { openGroup: false },
    });
  }
}

export async function handleAddStudent(e, state, dispatch) {
  e.preventDefault();
  const student = {
    username: state.student.name,
    student_id: state.student.student_id,
  };

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/students/${student.id}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let fetchAction = "POST";
  const data = await response.json();

  if (response.status === 200) {
    fetchAction = "PUT";
  }
  if (response.status === 404) {
    fetchAction = "POST";
  }

  const response2 = await fetch(
    `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/students` +
      (fetchAction === "PUT" ? `/${student.id}` : ""),
    {
      method: fetchAction,
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    }
  );
  const savedStudent = await response2.json();
  if (savedStudent) {
    console.log(savedStudent);
    dispatch({
      type: groupActions.addStudent,
      payload: {
        student: {
          student_id: state.student.id,
          username: state.student.name,
          id: savedStudent.student.id,
        },
      },
    });
  }
}

export function handleRemoveStudent(id, state, dispatch) {
  dispatch({
    type: groupActions.removeStudent,
    payload: { id: id },
  });
}
