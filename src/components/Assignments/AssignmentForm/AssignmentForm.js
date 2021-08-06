import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import useStyles from "../../../Hooks/useStyles/useStyles";
import actions from "../assignment-actions";

export default function AssignmentForm({
  assignment,
  exercises,
  groups,
  dispatch,
  handleSubmit,
  action = "CREATE",
}) {
  const classes = useStyles();
  return (
    <>
      <FormGroup className={classes.formGroup}>
        <InputLabel id="demo-simple-select-label">Ejercicio</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assignment.exercise.id}
          onChange={(e) => {
            const exercise = exercises.find(
              (exercise) => exercise.exercise_id === e.target.value
            );
            dispatch({
              type: actions.setExercise,
              payload: {
                exercise: { id: e.target.value, text: exercise.name },
              },
            });
          }}
        >
          {exercises.map((exercise) => (
            <MenuItem
              value={exercise.exercise_id}
              key={`exercise-${exercise.exercise_id}`}
            >
              {exercise.name}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <InputLabel id="demo-simple-select-label">Grupo</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assignment.group.id}
          onChange={(e) => {
            const group = groups.find(
              (group) => group.group_id === e.target.value
            );
            dispatch({
              type: actions.setGroup,
              payload: {
                group: {
                  id: e.target.value,
                  text: group.name,
                },
              },
            });
          }}
        >
          {groups.map((group) => (
            <MenuItem value={group.group_id} key={`group-${group.group_id}`}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <TextField
          id="standard-number"
          label="Fecha de Entrega"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={assignment.dueDate}
          onChange={(e) =>
            dispatch({
              type: actions.setDueDate,
              payload: { dueDate: e.target.value },
            })
          }
        />
      </FormGroup>
      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          size="large"
          className={classes.button}
          startIcon={<HighlightOffIcon />}
          type="button"
          onClick={(e) => {
            dispatch({
              type: actions.openAssignmentModal,
              payload: { openAssignment: false },
            });
            dispatch({
              type: actions.setAssignment,
              payload: {
                assignment: {
                  assignment_id: null,
                  group: { id: null, text: "" },
                  dueDate: "",
                  exercise: { id: null, text: "" },
                },
              },
            });
          }}
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
          onClick={(e) => handleSubmit(e, action)}
        >
          Guardar
        </Button>
      </div>
    </>
  );
}
