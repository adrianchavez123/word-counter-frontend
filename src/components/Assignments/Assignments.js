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
import GroupList from "../GroupList";
import ExerciseForm from "../Exercises/ExerciseForm";
import headers from "./assignment-headers";
import actions from "./assignment-actions";
import initialState from "./assignment-initialize";
import reducer from "./assignment-reducer";
import convertISOToYMD from "../../utils/dateUtils";
import AssignmentForm from "./AssignmentForm/AssignmentForm";

export default function Assignments() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

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
  const handleSubmit = (e, action) => {
    e.preventDefault();
    const assignment = {
      due_date: state.assignment.dueDate,
      exercise_id: state.assignment.exercise.id,
      group_id: state.assignment.group.id,
    };
    let fetched = null;
    if (action === "CREATE") {
      fetched = fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
      });
    } else if (action === "MODIFY") {
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
            action === "CREATE"
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

        if (action === "CREATE") {
          dispatch({
            type: actions.setAssignments,
            payload: {
              assignments: [...state.assignments, newAssignment],
            },
          });
        }

        if (action === "MODIFY") {
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
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/assignments/${id}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        console.log(state.assignments);
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
      const professorId = 1;
      const groupsResponse = await fetch(
        `http://localhost:5000/api/groups?professor_id=${professorId}`,
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
        `http://localhost:5000/api/exercises?professor_id=${professorId}`,
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
      await dispatch({
        type: actions.setExercises,
        payload: {
          exercises: [...exercises],
        },
      });

      const assignmentsResponse = await fetch(
        `http://localhost:5000/api/assignments?professor_id=${professorId}`,
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
  }, []);

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
              handleSubmit={handleSubmit}
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
