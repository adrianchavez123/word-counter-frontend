import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import useStyles from "../../../Hooks/useStyles/useStyles";
import actions from "../group-actions";
import GroupList from "../GroupList";

export default function GroupForm({
  group,
  student,
  handleCancel,
  handleSubmit,
  handleAddStudent,
  dispatch,
  editable = true,
  action = "CREATE",
}) {
  const classes = useStyles();
  return (
    <>
      <FormGroup className={classes.formGroup}>
        <InputLabel htmlFor="nombre">Nombre</InputLabel>
        <TextField
          id="nombre"
          placeholder="Ingresa el nombre del grupo"
          value={group.name}
          onChange={(e) =>
            dispatch({
              type: actions.setName,
              payload: { name: e.target.value },
            })
          }
          disabled={!editable}
        />
      </FormGroup>

      <FormGroup className={classes.formGroup}>
        <GroupList
          group={{ students: group.students }}
          showCloseButton={false}
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <InputLabel htmlFor="nombre">Estudiante</InputLabel>
        <TextField
          id="estudiante"
          placeholder="Nombre"
          value={student.name}
          onChange={(e) =>
            dispatch({
              type: actions.setStudentName,
              payload: { studentName: e.target.value },
            })
          }
          disabled={!editable}
        />
        <InputLabel htmlFor="nombre">Identificador</InputLabel>
        <TextField
          id="identificador"
          placeholder="Número de identificador"
          value={student.id}
          onChange={(e) =>
            dispatch({
              type: actions.setStudentId,
              payload: { studentId: e.target.value },
            })
          }
          disabled={!editable}
        />

        <Button
          variant="contained"
          size="large"
          className={classes.button}
          startIcon={<HighlightOffIcon />}
          type="button"
          onClick={handleAddStudent}
          style={{ marginRight: "1rem" }}
        >
          Agregar
        </Button>
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
