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

  const closeModal = () => {
    dispatch({
      type: actions.openExerciseModal,
      payload: { openExercise: false },
    });
  };

  const submitQuestions = async (data, action) => {
    let questionsWithId = [];
    let okay = true;
    if (state.exercise.questions) {
      const questionsData = state.exercise.questions.map((question) => {
        const questionData = {
          question_name: question.questionName,
          exercise_id:
            action === "MODIFY"
              ? state.exercise.exercise_id
              : data.exercise.exercise_id,
          question_id: question.questionId,
          options: JSON.stringify(
            question.options.map((o) => ({
              option_name: o.optionName,
              correct: o.correctAnswer,
            }))
          ),
        };
        return questionData;
      });
      const questionPromises = questionsData.map((questionData) => {
        let apiEndpoint = "api/questions";
        let method = "POST";
        if (action === "MODIFY") {
          apiEndpoint = `api/questions/${questionData.question_id}`;
          method = "PUT";
        }

        return fetch(
          `${process.env.REACT_APP_BACKEND_SERVICE_URL}/${apiEndpoint}`,
          {
            method: method,
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionData),
          }
        );
      });

      const response = await Promise.all([...questionPromises]);

      for await (const r of response) {
        if (!r.ok) {
          if (action === "MODIFY") {
            //new question at modification
            const urlParts = r.url.split("/");
            const endPointId = +urlParts[urlParts.length - 1];

            const newQuestion = questionsData.find(
              (q) => q.question_id === endPointId
            );
            if (newQuestion) {
              const apiEndpoint = "api/questions";
              const fetched2 = await fetch(
                `${process.env.REACT_APP_BACKEND_SERVICE_URL}/${apiEndpoint}`,
                {
                  method: "POST",
                  mode: "cors",
                  cache: "no-cache",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newQuestion),
                }
              );

              const question = await setQuestionId(fetched2);
              questionsWithId.push(question);
            }
          } else {
            okay = false;
          }
        } else {
          if (action === "CREATE") {
            const question = await setQuestionId(r);
            questionsWithId.push(question);
          }
        }
      }

      if (!okay) {
        console.log("Something went wrong saving the questions.");
        return false;
      }
      return questionsWithId;
    }
    return false;
  };

  const setQuestionId = async (promise) => {
    const question = await promise.json();
    return await new Promise((resolve, refeject) => {
      dispatch({
        type: actions.setQuestionId,
        payload: { question: question.question },
      });
      resolve(question.question);
    });
  };

  const handleRemoveQuestion = async (e, questionId) => {
    e.preventDefault();
    const apiEndpoint = "api/questions";
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/${apiEndpoint}/${questionId}`,
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const deleteResponse = await response.json();
    console.log(deleteResponse.message);

    dispatch({
      type: actions.deleteQuestion,
      payload: {
        questionId: questionId,
      },
    });
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
      content: state.exercise.content,
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
      .then(async (data) => {
        const questionsSaved = await submitQuestions(data, action);
        let questions = [];
        if (questionsSaved) {
          questions = questionsSaved.map((question) => ({
            questionId: question.question_id,
            questionName: question.question_name,
            options: question.options.map((option) => ({
              optionName: option.option_name,
              correctAnswer: option.correct,
            })),
          }));
        }
        return { questionsSaved: questions, data: data };
      })
      .then(async ({ questionsSaved, data }) => {
        const emptyQuestions = [
          {
            questionId: 0,
            questionName: "",
            options: [
              { optionName: "", correctAnswer: false },
              { optionName: "", correctAnswer: false },
              { optionName: "", correctAnswer: false },
              { optionName: "", correctAnswer: false },
            ],
          },
        ];

        if (action === "CREATE") {
          dispatch({
            type: actions.setExercises,
            payload: {
              exercises: [
                ...state.exercises,
                {
                  ...exercise,
                  exercise_id: data.exercise.exercise_id,
                  questions: questionsSaved
                    ? [...questionsSaved]
                    : emptyQuestions,
                },
              ],
            },
          });
        } else if (action === "MODIFY") {
          const exercises = state.exercises.filter(
            (exercise) => exercise.exercise_id !== state.exercise.exercise_id
          );
          dispatch({
            type: actions.setExercises,
            payload: {
              exercises: [
                ...exercises,
                {
                  ...exercise,
                  exercise_id: state.exercise.exercise_id,
                  questions: questionsSaved
                    ? [...state.exercise.questions]
                    : emptyQuestions,
                },
              ],
            },
          });
        }
        closeModal();
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

  const includeQuestionsToTheExercises = async (exercises) => {
    const exercisePromises = exercises.map((exercise) => {
      const professor_id = currentUser.uid;
      const id = exercise.exercise_id;
      return fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/questions?exercise_id=${id}&professor_id=${professor_id}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    const questions = await Promise.all([...exercisePromises]);
    const newExercises = [];
    for await (const question of questions) {
      const exerciseQuestions = await question.json();
      if (question.ok) {
        const exerciseIndex = exercises.findIndex(
          (exercise) => exercise.exercise_id === exerciseQuestions.exercise.id
        );

        if (exerciseIndex > -1) {
          const questions = exerciseQuestions.questions.map((q) => ({
            questionId: q.question_id,
            questionName: q.question_name,
            options: q.options.map((o) => ({
              optionName: o.option_name,
              correctAnswer: o.correct,
            })),
          }));
          newExercises.push({
            ...exercises[exerciseIndex],
            questions: questions,
          });
        }
      } else {
        const url = new URL(question.url);
        const exercise_id = +url.searchParams.get("exercise_id");
        const exerciseIndex = exercises.findIndex(
          (exercise) => exercise.exercise_id === exercise_id
        );

        if (exerciseIndex > -1) {
          newExercises.push({
            ...exercises[exerciseIndex],
            questions: [],
          });
        }
      }
    }
    return newExercises;
  };
  useEffect(() => {
    let mounted = true;
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
        const promises = includeQuestionsToTheExercises(data);
        promises.then((updatedData) => {
          if (mounted) {
            dispatch({
              type: actions.setExercises,
              payload: {
                exercises: updatedData,
              },
            });
          }
        });
      })
      .catch((error) => console.log(error));

    return () => {
      mounted = false;
    };
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
                type: actions.clearModal,
                payload: {},
              });
              dispatch({
                type: actions.openExerciseModal,
                payload: { openExercise: !state.openExercise },
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
                      content: "",
                    },
                  },
                });
              }}
              handleSubmit={handleSubmit}
              dispatch={dispatch}
              editable={true}
              action={state.action}
              handleRemoveQuestion={handleRemoveQuestion}
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
