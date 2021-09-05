import { groupActions } from ".";

export function handleSubmitGroup(e, state, dispatch, professor_id) {
  e.preventDefault();
  let fetched = null;
  const group = {
    name: state.group.name,
    students: state.group.students.map((student) => student.student_id),
    professor_id: professor_id,
  };
  if (state.action === "CREATE") {
    fetched = fetch("http://localhost:5000/api/groups", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    });
  } else if (state.action === "MODIFY") {
    fetched = fetch(
      `http://localhost:5000/api/groups/${state.group.group_id}`,
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

  fetched
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (state.action === "CREATE") {
        dispatch({
          type: groupActions.setGroups,
          payload: {
            groups: [
              ...state.groups,
              { ...group, group_id: data.group.group_id },
            ],
          },
        });
      }
      if (state.action === "MODIFY") {
        const groups = state.groups.filter(
          (group) => group.group_id !== state.group.group_id
        );
        dispatch({
          type: groupActions.setGroups,
          payload: {
            groups: [...groups, { ...group, group_id: state.group.group_id }],
          },
        });
      }
      dispatch({
        type: groupActions.openGroupModal,
        payload: { openGroup: false },
      });

      dispatch({
        type: groupActions.setGroup,
        payload: {
          group: {
            name: "",
            students: [],
          },
        },
      });
    })
    .catch((error) => console.log(error));
}

export function handleAddStudent(e, state, dispatch) {
  e.preventDefault();
  let fetched = null;
  const student = {
    username: state.student.name,
    student_id: state.student.id,
  };

  const fetchStudent = fetch(
    `http://localhost:5000/api/students/${student.student_id}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return "PUT";
      }
      if (response.status === 404) {
        return "POST";
      }
    })
    .then((fetchAction) => {
      fetched = fetch(
        "http://localhost:5000/api/students" +
          (fetchAction === "PUT" ? `/${student.student_id}` : ""),
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
      fetched
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          dispatch({
            type: groupActions.addStudent,
            payload: {
              student: {
                student_id: state.student.id,
                username: state.student.name,
              },
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });

  return;
}

export function handleRemoveStudent(student_id, state, dispatch) {
  console.log("handleRemoveStudent");
  console.log(student_id);

  console.log(state);
  console.log(dispatch);
  dispatch({
    type: groupActions.removeStudent,
    payload: { student: student_id },
  });
}
