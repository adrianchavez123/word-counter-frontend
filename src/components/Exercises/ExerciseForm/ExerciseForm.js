import React, { useState } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
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
