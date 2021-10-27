import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import useStyles from "../../../Hooks/useStyles/useStyles";
import actions from "../group-actions";
import GroupList from "../GroupList";
import { CSVLink } from "react-csv";
import GetAppIcon from "@material-ui/icons/GetApp";

export default function GroupForm({
  group,
  student,
  handleCancel,
  handleSubmit,
  handleRemoveStudent,
  handleAddStudent,
  state,
  dispatch,
  editable = true,
  action = "MODIFY",
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
        <InputLabel htmlFor="nombre">Token</InputLabel>
        <TextField
          id="token"
          placeholder="token"
          value={group.token}
          disabled
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <GroupList
          group={{ students: group.students }}
          showCloseButton={false}
          removeMembers={true}
          state={state}
          dispatch={dispatch}
          handleRemoveStudent={handleRemoveStudent}
        />
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <div className={classes.addStudent}>
          {/* <div className={classes.addStudentField}>
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
          </div> */}

          {/* <Button
            variant="contained"
            size="large"
            className={classes.button}
            startIcon={<AddCircleIcon />}
            type="button"
            onClick={handleAddStudent}
            style={{ marginRight: "1rem" }}
          >
            Agregar
          </Button> */}
        </div>
        <div style={{ margin: "0.5rem" }}>
          <CSVLink
            data={[
              ["numero", "nombre"],
              ...group.students
                .filter((st) => st.id != null)
                .map((student) => [student.id, student.username]),
            ]}
            filename={"lista de alumnos.csv"}
          >
            Descargar lista
            <GetAppIcon
              style={{ fontSize: "1.2rem", position: "relative", top: ".4rem" }}
            />
          </CSVLink>
        </div>
      </FormGroup>{" "}
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
