import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import Table from "../../Table";
import ModalForm from "../ModalForm/ModalForm";
import deleteResource from "../../utils/deleteResource";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import headers from "./exercise-headers";
import actions from "./exercise-actions";
import initialState from "./exercise-initialize";
import reducer from "./exercise-reducer";

export default function Ejercicios() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDelete = (id) => {
    const promise = deleteResource({ id: id, resourceType: "exercises" });
    promise.then((deleted) => {
      if (deleted) {
        dispatch({
          type: actions.setExercises,
          payload: {
            exercises: state.exercises.filter((exercise) => exercise[0] !== id),
          },
        });
      }
    });
  };

  const handleModify = (id) => {
    const record = state.exercises.filter((row) => row[0] === id);
    if (record) {
      const [, ...exercise] = record;
      dispatch({
        type: actions.setExercise,
        payload: {
          exercise: {
            title: exercise[0],
            description: exercise[1],
            wordsAmount: exercise[2],
          },
        },
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const exercise = {
      title: state.exercise.title,
      description: state.exercise.description,
      words_amount: state.exercise.wordsAmount,
      professor_id: 1,
    };

    fetch("http://localhost:5000/api/exercises", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exercise),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
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

        dispatch({
          type: actions.setExercises,
          payload: {
            exercises: [
              ...state.exercises,
              [
                data.exercise.exercise_id,
                exercise.title,
                exercise.description,
                exercise.words_amount,
              ],
            ],
          },
        });

        dispatch({
          type: actions.openExerciseModal,
          payload: { openExercise: false },
        });
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const professorId = 1;
    fetch(`http://localhost:5000/api/exercises?professor_id=${professorId}`, {
      method: "GET",
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
        const exercises = data.map((exercise) => [
          exercise.exercise_id,
          exercise.title,
          exercise.description,
          exercise.words_amount,
        ]);

        dispatch({
          type: actions.setExercises,
          payload: {
            exercises,
          },
        });
      })
      .catch((error) => console.log(error));
  }, []);
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
            setOpen={() =>
              dispatch({
                type: actions.openExerciseModal,
                payload: { openExercise: !state.openExercise },
              })
            }
          >
            <FormGroup className={classes.formGroup}>
              <InputLabel htmlFor="titulo">Titulo</InputLabel>
              <TextField
                id="titulo"
                placeholder="Titulo"
                value={state.exercise.title}
                onChange={(e) =>
                  dispatch({
                    type: actions.setTitle,
                    payload: { title: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <InputLabel htmlFor="descripcion">Descripción</InputLabel>
              <TextareaAutosize
                aria-label="Descripción"
                minRows={10}
                placeholder="Ingresa una descripción"
                value={state.exercise.description}
                onChange={(e) =>
                  dispatch({
                    type: actions.setDescription,
                    payload: { description: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <InputLabel htmlFor="cantidad-palabras">
                Cantidad de palabras en el texto
              </InputLabel>

              <TextField
                id="cantidad-palabras"
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.exercise.wordsAmount}
                onChange={(e) =>
                  dispatch({
                    type: actions.setWordsAmount,
                    payload: { wordsAmount: e.target.value },
                  })
                }
              />
            </FormGroup>
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="contained"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                type="submit"
                onClick={(e) =>
                  dispatch({
                    type: actions.openExerciseModal,
                    payload: { openExercise: false },
                  })
                }
                style={{ marginRight: "1rem" }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                type="submit"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </div>
          </ModalForm>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Table
            title="Ejercicios"
            headers={headers}
            rows={state.exercises}
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
