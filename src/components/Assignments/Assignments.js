import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";
import ModalForm from "../ModalForm/ModalForm";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Table from "../../Table";
import { GroupList } from "../Groups";
import ExerciseForm from "../Exercises/ExerciseForm";
import headers from "./assignment-headers";
import actions from "./assignment-actions";
import initialState from "./assignment-initialize";
import reducer from "./assignment-reducer";
import convertISOToYMD from "../../utils/dateUtils";
import { AssignmentForm, handleAssignmentSubmit } from ".";
import { useAuth } from "../../contexts/AuthContext";

export default function Assignments() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();

  const handleModify = (id) => {
    dispatch({
      type: actions.setAction,
      payload: { action: "MODIFY" },
    });

    const assignment = state.assignments.find(
      (assignment) => assignment.assignment_id === id
    );
    if (assignment) {
      const updateAssignment = {
        ...assignment,
        group: {
          id: assignment.group.group_id,
          text: assignment.group.group_name,
        },
        exercise: {
          id: assignment.exercise.exercise_id,
          text: assignment.exercise.title,
        },
        dueDate: convertISOToYMD(assignment.due_date),
      };
      dispatch({
        type: actions.setAssignment,
        payload: {
          assignment: { ...updateAssignment },
        },
      });
    }
    dispatch({
      type: actions.openAssignmentModal,
      payload: { openAssignment: true },
    });
  };

  const handleExerciseDetails = (id, exercises) => {
    dispatch({
      type: actions.openExerciseModal,
      payload: { openExercise: true },
    });

    const exercise = exercises.find((exercise) => exercise.exercise_id === id);
    if (exercise) {
      dispatch({
        type: actions.setExerciseSelected,
        payload: { exerciseSelected: exercise },
      });
    }
  };

  const handleGroupDetails = (id, groups = []) => {
    dispatch({
      type: actions.openGroupModal,
      payload: { openGroup: true },
    });

    const group = groups.find((group) => group.group_id === id);
    if (group) {
      dispatch({
        type: actions.setGroupSelected,
        payload: { groupSelected: group },
      });
    }
  };

  const handleDelete = (id) => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/assignments/${id}`,
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.message === "Assignment deleted!") {
          dispatch({
            type: actions.setAssignments,
            payload: {
              assignments: state.assignments.filter(
                (assignment) => assignment.assignment_id !== id
              ),
            },
          });
        }
      });
  };

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
        await dispatch({
          type: actions.setGroups,
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
        ...exercise,
        exercise_id: exercise.exercise_id,
        name: exercise.title,
      }));
      await dispatch({
        type: actions.setExercises,
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
      await dispatch({
        type: actions.setAssignments,
        payload: { assignments: [...asignmentsData] },
      });
    };
    loadData();
  }, [currentUser.uid]);

  const flatAssignments = () => {
    return state.assignments.map((assignment) => {
      return [
        assignment.assignment_id,
        {
          id: assignment.exercise.exercise_id,
          text: assignment.exercise.title,
          onClick: (e) =>
            handleExerciseDetails(
              assignment.exercise.exercise_id,
              state.exercises
            ),
        },
        {
          id: assignment.group.group_id,
          text: assignment.group.group_name,
          onClick: (e) => {
            handleGroupDetails(assignment.group.group_id, state.groups);
          },
        },
        convertISOToYMD(assignment.due_date),
      ];
    });
  };

  return (
    <Grid container spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={"/"}>Inicio</Link>
        <Typography color="textPrimary">Tareas</Typography>
      </Breadcrumbs>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Crear una nueva tarea</Title>
          <ModalForm
            buttonTitle="grupo"
            title={`Grupo: ${state.groupSelected.name}`}
            open={state.openGroup}
            setOpen={(openGroup) => {
              dispatch({
                type: actions.openGroupModal,
                payload: { openGroup: openGroup },
              });
            }}
            showButton={false}
          >
            <GroupList
              group={state.groupSelected}
              onClose={() =>
                dispatch({
                  type: actions.openGroupModal,
                  payload: { openGroup: false },
                })
              }
            />
          </ModalForm>

          <ModalForm
            buttonTitle="Ejercicio"
            title={`Ejercicio: ${state.exerciseSelected.title}`}
            open={state.openExercise}
            setOpen={(openExercise) => {
              dispatch({
                type: actions.openExerciseModal,
                payload: { openExercise: openExercise },
              });
            }}
            showButton={false}
          >
            <ExerciseForm
              exercise={{
                ...state.exerciseSelected,
                wordsAmount: state.exerciseSelected.words_amount,
              }}
              handleCancel={(e) =>
                dispatch({
                  type: actions.openExerciseModal,
                  payload: { openExercise: false },
                })
              }
              editable={false}
              dispatch={dispatch}
            />
          </ModalForm>

          <ModalForm
            buttonTitle="Crear"
            title="Crear Tarea"
            open={state.openAssignment}
            setOpen={(openAssignment) => {
              dispatch({
                type: actions.openAssignmentModal,
                payload: { openAssignment: openAssignment },
              });
              dispatch({
                type: actions.setAction,
                payload: { action: "CREATE" },
              });
            }}
          >
            <AssignmentForm
              assignment={state.assignment}
              exercises={state.exercises}
              groups={state.groups}
              handleSubmit={(e) => handleAssignmentSubmit(e, state, dispatch)}
              dispatch={dispatch}
              action={state.action}
            />
          </ModalForm>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Table
            title="Tareas"
            headers={headers}
            rows={flatAssignments()}
            resource="assignments"
            handleModify={handleModify}
            handleDelete={handleDelete}
            showActions={true}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
