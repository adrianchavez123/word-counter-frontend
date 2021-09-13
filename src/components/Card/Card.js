import React, { useReducer, useEffect } from "react";
import Link from "@material-ui/core/Link";
import GroupForm from "../Groups/GroupForm";
import ModalForm from "../ModalForm";
import Title from "../Title/Title";
import {
  groupActions,
  groupReducer,
  groupInitialize,
  handleSubmitGroup,
  handleAddStudent,
  handleRemoveStudent,
} from "../Groups";
import {
  AssignmentForm,
  assignmentActions,
  assignmentReducer,
  assignmentInitialize,
  handleAssignmentSubmit,
} from "../Assignments";
import { useAuth } from "../../contexts/AuthContext";

export default function Card() {
  const [state, dispatch] = useReducer(groupReducer, groupInitialize);
  const [assignmentState, assignmentDispatch] = useReducer(
    assignmentReducer,
    assignmentInitialize
  );
  const { currentUser } = useAuth();
  const professor_id = currentUser.uid;

  useEffect(() => {
    const loadData = async () => {
      const professor_id = currentUser.uid;
      const groupsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/groups?professor_id=${professor_id}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const groupsData = await groupsResponse.json();
      if (groupsData?.groups) {
        await assignmentDispatch({
          type: assignmentActions.setGroups,
          payload: {
            groups: [...groupsData.groups],
          },
        });
      }

      const exercisesResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/exercises?professor_id=${professor_id}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const exerciseData = await exercisesResponse.json();
      const exercises = exerciseData.map((exercise) => ({
        exercise_id: exercise.exercise_id,
        name: exercise.title,
      }));
      await assignmentDispatch({
        type: assignmentActions.setExercises,
        payload: {
          exercises: [...exercises],
        },
      });

      const assignmentsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/assignments?professor_id=${professor_id}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const asignmentsData = await assignmentsResponse.json();
      await assignmentDispatch({
        type: assignmentActions.setAssignments,
        payload: { assignments: [...asignmentsData] },
      });
    };
    loadData();
  }, [currentUser.uid]);

  return (
    <React.Fragment>
      <Title>Crear nueva tarea</Title>
      <ModalForm
        buttonTitle="Crear"
        title="Crear Tarea"
        open={assignmentState.openAssignment}
        setOpen={(openAssignment) => {
          assignmentDispatch({
            type: assignmentActions.openAssignmentModal,
            payload: { openAssignment: openAssignment },
          });
          assignmentDispatch({
            type: assignmentActions.setAction,
            payload: { action: "CREATE" },
          });
        }}
      >
        <AssignmentForm
          assignment={assignmentState.assignment}
          exercises={assignmentState.exercises}
          groups={assignmentState.groups}
          handleSubmit={(e) =>
            handleAssignmentSubmit(e, assignmentState, assignmentDispatch)
          }
          dispatch={assignmentDispatch}
          action={assignmentState.action}
        />
      </ModalForm>

      <div style={{ marginTop: "1rem" }}>
        <Link
          href="#"
          onClick={() =>
            dispatch({
              type: groupActions.openGroupModal,
              payload: { openGroup: !state.openGroup },
            })
          }
        >
          Crear un nuevo grupo
        </Link>
      </div>
      <ModalForm
        buttonTitle="Crear grupo"
        title="Crear Grupo"
        open={state.openGroup}
        showButton={false}
        setOpen={() => {
          dispatch({
            type: groupActions.openGroupModal,
            payload: { openGroup: !state.openGroup },
          });
          dispatch({
            type: groupActions.setAction,
            payload: { action: "CREATE" },
          });
        }}
      >
        <GroupForm
          group={state.group}
          student={state.student}
          handleCancel={(e) => {
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
                  professor_id: null,
                },
              },
            });
          }}
          handleSubmit={(e) =>
            handleSubmitGroup(e, state, dispatch, professor_id)
          }
          handleAddStudent={(e) => handleAddStudent(e, state, dispatch)}
          handleRemoveStudent={handleRemoveStudent}
          dispatch={dispatch}
          editable={true}
          action={"CREATE"}
        />
      </ModalForm>
    </React.Fragment>
  );
}
