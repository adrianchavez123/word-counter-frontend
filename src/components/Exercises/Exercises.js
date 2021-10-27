import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";
import Table from "../../Table";
import ModalForm from "../ModalForm/ModalForm";
import deleteResource from "../../utils/deleteResource";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import headers from "./exercise-headers";
import actions from "./exercise-actions";
import initialState from "./exercise-initialize";
import reducer from "./exercise-reducer";
import ExerciseForm from "./ExerciseForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Ejercicios() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();

  const handleDelete = (id) => {
    const promise = deleteResource({ id: id, resourceType: "exercises" });
    promise.then((deleted) => {
      if (deleted) {
        dispatch({
          type: actions.setExercises,
          payload: {
            exercises: state.exercises.filter(
              (exercise) => exercise.exercise_id !== id
            ),
          },
        });
      }
    });
  };

  const handleModify = (id) => {
    dispatch({
      type: actions.setAction,
      payload: { action: "MODIFY" },
    });
    dispatch({
      type: actions.openExerciseModal,
      payload: { openExercise: true },
    });

    const exercise = state.exercises.find(
      (exercise) => exercise.exercise_id === id
    );
    if (exercise) {
      dispatch({
        type: actions.setExercise,
        payload: {
          exercise: {
            ...exercise,
            wordsAmount: exercise.words_amount,
          },
        },
      });
    }
  };
  const handleSubmit = (e, action) => {
    e.preventDefault();
    let fetched = null;
    const exercise = {
      title: state.exercise.title,
      description: state.exercise.description,
      words_amount: state.exercise.wordsAmount,
      professor_id: currentUser.uid,
      exercise_image: state.exercise.exercise_image,
    };

    if (action === "CREATE") {
      fetched = fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/exercises`,
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exercise),
        }
      );
    } else if (action === "MODIFY") {
      fetched = fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/exercises/${state.exercise.exercise_id}`,
        {
          method: "PUT",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exercise),
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
        if (action === "CREATE") {
          dispatch({
            type: actions.setExercises,
            payload: {
              exercises: [
                ...state.exercises,
                { ...exercise, exercise_id: data.exercise.exercise_id },
              ],
            },
          });
        }
        if (action === "MODIFY") {
          const exercises = state.exercises.filter(
            (exercise) => exercise.exercise_id !== state.exercise.exercise_id
          );
          dispatch({
            type: actions.setExercises,
            payload: {
              exercises: [
                ...exercises,
                { ...exercise, exercise_id: state.exercise.exercise_id },
              ],
            },
          });
        }
        dispatch({
          type: actions.openExerciseModal,
          payload: { openExercise: false },
        });

        dispatch({
          type: actions.setExercise,
          payload: {
            exercise: {
              title: "",
              description: "",
              wordsAmount: 0,
              exercise_id: null,
              exercise_image: "",
            },
          },
        });
      })
      .catch((error) => console.log(error));
  };

  const flatExercises = () => {
    return state.exercises.map((exercise) => {
      return [
        exercise.exercise_id,
        exercise.title,
        exercise.description,
        exercise.words_amount,
      ];
    });
  };
  useEffect(() => {
    const professor_id = currentUser.uid;
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/exercises?professor_id=${professor_id}`,
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
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        dispatch({
          type: actions.setExercises,
          payload: {
            exercises: [...data],
          },
        });
      })
      .catch((error) => console.log(error));
  }, [currentUser.uid]);
  return (
    <Grid container spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={"/"}>Inicio</Link>
        <Typography color="textPrimary">Ejercicios</Typography>
      </Breadcrumbs>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Crear un nuevo ejercicio</Title>
          <ModalForm
            buttonTitle="Crear"
            title="Crear Ejercicio"
            open={state.openExercise}
            setOpen={() => {
              dispatch({
                type: actions.openExerciseModal,
                payload: { openExercise: !state.openExercise },
              });
              dispatch({
                type: actions.setAction,
                payload: { action: "CREATE" },
              });
            }}
          >
            <ExerciseForm
              exercise={state.exercise}
              handleCancel={(e) => {
                dispatch({
                  type: actions.openExerciseModal,
                  payload: { openExercise: false },
                });
                dispatch({
                  type: actions.setExercise,
                  payload: {
                    exercise: {
                      title: "",
                      description: "",
                      wordsAmount: 0,
                    },
                  },
                });
              }}
              handleSubmit={handleSubmit}
              dispatch={dispatch}
              editable={true}
              action={state.action}
            />
          </ModalForm>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Table
            title="Ejercicios"
            headers={headers}
            rows={flatExercises()}
            resource="exercises"
            handleModify={handleModify}
            handleDelete={handleDelete}
            showActions={true}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
