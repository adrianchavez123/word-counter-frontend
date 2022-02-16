import React, { useState } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import useStyles from "../../../Hooks/useStyles/useStyles";
import actions from "../exercise-actions";
import ImageUpload from "image-upload-react";

export default function ExerciseForm({
  exercise,
  handleCancel,
  handleSubmit,
  dispatch,
  editable = true,
  action = "CREATE",
}) {
  const classes = useStyles();
  const [imageSrc, setImageSrc] = useState();

  const handleImageSelect = (e) => {
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    dispatch({
      type: actions.setExerciseImage,
      payload: { exercise_image: e.target.files[0].name },
    });

    const files = e.target.files;
    const formData = new FormData();
    formData.append("image", files[0]);

    fetch(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/image`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <FormGroup className={classes.formGroup}>
        <InputLabel htmlFor="titulo">Titulo</InputLabel>
        <TextField
          id="titulo"
          placeholder="Titulo"
          value={exercise.title}
          onChange={(e) =>
            dispatch({
              type: actions.setTitle,
              payload: { title: e.target.value },
            })
          }
          disabled={!editable}
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <InputLabel htmlFor="descripcion">Descripción</InputLabel>
        <TextareaAutosize
          aria-label="Descripción"
          minRows={10}
          placeholder="Ingresa una descripción"
          value={exercise.description}
          onChange={(e) =>
            dispatch({
              type: actions.setDescription,
              payload: { description: e.target.value },
            })
          }
          disabled={!editable}
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <InputLabel htmlFor="descripcion">Texto en lectura</InputLabel>
        <TextareaAutosize
          aria-label="Descripción"
          minRows={10}
          placeholder="Ingresa el texto en la lectura"
          value={exercise.content}
          onChange={(e) => {
            const text = e.target.value;
            dispatch({
              type: actions.setContent,
              payload: { content: text },
            });

            dispatch({
              type: actions.setWordsAmount,
              payload: {
                wordsAmount: text.replace(/\n/g, "").split(/(\s+)/).length,
              },
            });
          }}
          disabled={!editable}
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
          value={exercise.wordsAmount}
          onChange={(e) =>
            dispatch({
              type: actions.setWordsAmount,
              payload: { wordsAmount: e.target.value },
            })
          }
          disabled={!editable}
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <InputLabel htmlFor="cuestionario">Cuestonario</InputLabel>
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            startIcon={<AddIcon />}
            type="submit"
            onClick={(e) =>
              dispatch({
                type: actions.addQuestion,
                payload: {},
              })
            }
          >
            Agregar pregunta
          </Button>
        </div>
        <div>
          {exercise.questions?.map((question, i) => {
            return (
              <div key={question.questionId} style={{ padding: "0.5rem 0" }}>
                <div
                  style={{
                    width: "100%",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <InputLabel
                      htmlFor={`pregunta-${question.questionId}`}
                    >{`Pregunta ${i + 1}`}</InputLabel>
                    <TextField
                      id={`pregunta-${question.questionId}`}
                      placeholder={`Pregunta ${i + 1}`}
                      value={question.questionName}
                      disabled={!editable}
                      fullWidth
                      onChange={(e) =>
                        dispatch({
                          type: actions.setQuestionName,
                          payload: {
                            questionName: e.target.value,
                            questionId: question.questionId,
                          },
                        })
                      }
                    />
                  </div>
                  <ClearIcon
                    onClick={(e) =>
                      dispatch({
                        type: actions.deleteQuestion,
                        payload: {
                          questionId: question.questionId,
                        },
                      })
                    }
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    padding: "2rem",
                  }}
                >
                  {question.options.map((option, i) => {
                    const optionKey = `pregunta-${question.questionId}-${i}`;
                    return (
                      <div
                        key={optionKey}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id={`${optionKey}-opcion-${i}`}
                          placeholder={`Opción ${i + 1}`}
                          value={option.optionName}
                          onChange={(e) =>
                            dispatch({
                              type: actions.setOptionName,
                              payload: {
                                questionId: question.questionId,
                                optionPosition: i,
                                optionName: e.target.value,
                              },
                            })
                          }
                          disabled={!editable}
                        />
                        <label htmlFor="">Resp. correcta</label>

                        <Radio
                          checked={option.correctAnswer}
                          onChange={(e) =>
                            dispatch({
                              type: actions.setCorrectResponse,
                              payload: {
                                questionId: question.questionId,
                                optionPosition: i,
                              },
                            })
                          }
                          value={option.optionName}
                          name={`radio-buttons-${question.questionId}`}
                          inputProps={{ "aria-label": option.optionName }}
                        />
                        <ClearIcon
                          onClick={(e) =>
                            dispatch({
                              type: actions.deleteOption,
                              payload: {
                                questionId: question.questionId,
                                optionPosition: i,
                              },
                            })
                          }
                        />
                      </div>
                    );
                  })}
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    startIcon={<AddIcon />}
                    type="submit"
                    onClick={(e) =>
                      dispatch({
                        type: actions.addOption,
                        payload: {
                          questionId: question.questionId,
                        },
                      })
                    }
                  >
                    Agregar opción
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </FormGroup>
      <FormGroup className={classes.formGroup} style={{ marginBottom: "5rem" }}>
        <InputLabel htmlFor="Imagen">Imagen</InputLabel>
        <ImageUpload
          handleImageSelect={handleImageSelect}
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          style={{
            width: 400,
            height: 250,
            background: "#f4f4f4",
          }}
        />
      </FormGroup>
      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          size="large"
          className={classes.button}
          startIcon={<HighlightOffIcon />}
          type="button"
          onClick={handleCancel}
          style={{ marginRight: "1rem" }}
        >
          Cancelar
        </Button>
        {editable && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<SaveIcon />}
            type="submit"
            onClick={(e) => handleSubmit(e, action)}
          >
            Guardar
          </Button>
        )}
      </div>
    </>
  );
}
