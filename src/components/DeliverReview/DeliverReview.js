import React, { useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import InputLabel from "@material-ui/core/InputLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
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
    let mounted = true;
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
          if (mounted) {
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
        }
      })
      .catch((error) => console.log(error));

    return () => {
      mounted = false;
    };
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

  useEffect(() => {
    let mounted = true;

    fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/deliver-assignment-answers?deliver_assignment_id=${deliverAssignmentId}`,
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
        if (mounted) {
          if (data?.questions) {
            const formattedQuestions = data.questions.map((question) => ({
              questionId: question.question_id,
              questionName: question.question_name,
              correct: question.optionSelected.correct,
              options: question.options.map((option) => ({
                optionId: option.option_id,
                optionName: option.option_name,
                answerSelected:
                  option.option_id ===
                  question.optionSelected.question_option_id,
              })),
            }));
            dispatch({
              type: actions.setExerciseDetails,
              payload: {
                questions: [...formattedQuestions],
              },
            });
          }
        }
      });

    return () => {
      mounted = false;
    };
  }, [deliverAssignmentId]);

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
          {state.questions && (
            <div style={{ marginTop: "1rem" }}>
              <Title>Cuestionario</Title>
              {state.questions.map((question, i) => (
                <div key={question.questionId}>
                  <p
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {question.correct ? (
                      <CheckIcon
                        style={{ fontSize: "2rem", color: "#2e7d32" }}
                      />
                    ) : (
                      <ClearIcon
                        style={{ fontSize: "2rem", color: "#d32f2f" }}
                      />
                    )}
                    {i + 1}
                    {") "}
                    {question.questionName}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 4rem",
                    }}
                  >
                    {question.options.map((option) => (
                      <>
                        <label htmlFor="">{option.optionName}</label>
                        <Radio
                          checked={!!option.answerSelected}
                          disabled
                          value={option.optionName}
                          name={`radio-buttons-${question.questionId}`}
                          inputProps={{ "aria-label": option.optionName }}
                        />
                      </>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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
