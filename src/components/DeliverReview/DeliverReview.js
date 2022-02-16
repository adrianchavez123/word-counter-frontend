import React, { useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Title from "../Title";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import useStyles from "../../Hooks/useStyles/useStyles";
import actions from "./deliver-review-actions";
import reducer from "./deliver-review-reducer";
import initialize from "./deliver-review-initialize";
import convertISOToYMD from "../../utils/dateUtils";

export default function DeliverReview() {
  let { deliverAssignmentId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialize);
  const classes = useStyles();

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/deliver-assignments/${deliverAssignmentId}`,
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
        if (data) {
          const results = data[0];
          dispatch({
            type: actions.setDeliver,
            payload: {
              student: `${results.student.username}(${results.student.id})`,
              assignment: `${results.exercise.title}`,
              arriveAt: convertISOToYMD(results.arrive_at),
              totalWordsDetected: results.total_words_detected,
              dueDate: convertISOToYMD(results.assignment.due_date),
              exerciseId: results.exercise.exercise_id,
              audioURL: results.audio_URL,
              speechToText: results.speech_to_text,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, [deliverAssignmentId]);

  useEffect(() => {
    if (!state.exerciseId) {
      return;
    }
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/exercises/${state.exerciseId}`,
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
        if (data) {
          const results = data[0];
          dispatch({
            type: actions.setExerciseDetails,
            payload: {
              description: results.description,
              totalWordsInTheLecture: results.words_amount,
              imageURL: results.exercise_image,
              content: results.content,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, [state.exerciseId]);

  return (
    <Grid container spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={"/"}>Inicio</Link>
        <Link to={"/alumnos"}>Alumnos</Link>
        <Typography color="textPrimary">Resumen Tarea Recibida</Typography>
      </Breadcrumbs>

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Tarea Recibida</Title>
          <div className={classes.review}>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">Alumno</InputLabel>
              <TextField
                value={state.student}
                readOnly
                className={classes.textFullWidth}
              />
            </div>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">Tarea</InputLabel>
              <TextField
                value={state.assignment}
                readOnly
                className={classes.textFullWidth}
              />
            </div>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">
                Fecha de entrega
              </InputLabel>
              <TextField
                value={state.arriveAt}
                readOnly
                className={classes.textFullWidth}
              />
            </div>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">
                Fecha limite de entrega
              </InputLabel>
              <TextField
                value={state.dueDate}
                readOnly
                className={classes.textFullWidth}
              />
            </div>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">
                Cantidad de palabras en el texto
              </InputLabel>
              <TextField
                value={state.totalWordsInTheLecture}
                readOnly
                className={classes.textFullWidth}
              />
            </div>
            <div>
              <InputLabel id="demo-mutiple-checkbox-label">
                Cantidad de palabras detectadas
              </InputLabel>
              <TextField
                value={state.totalWordsDetected}
                className={classes.textFullWidth}
              />
            </div>
          </div>
          <Title>Description</Title>

          <TextareaAutosize
            minRows={5}
            aria-label="empty textarea"
            placeholder="Descripcion"
            readOnly
            value={state.description}
          />
          <div style={{ marginTop: "1rem" }}>
            <Title>Audio</Title>
            <audio src={state.audioURL} controls />
          </div>
          <Title>Texto detectado</Title>
          <TextareaAutosize
            minRows={5}
            aria-label="texto detectado"
            placeholder="Texto"
            readOnly
            value={state.speechToText + "\n ----\n" + state.content}
          />
          {state.imageURL && (
            <div style={{ marginTop: "1rem" }}>
              <Title>Imagen</Title>
              <div>
                <img
                  src={state.imageURL}
                  alt={state.imageURL}
                  style={{ maxWidth: "800px" }}
                />
              </div>
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
