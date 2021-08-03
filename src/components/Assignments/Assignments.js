import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ModalForm from "../ModalForm/ModalForm";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Table from "../../Table";
import headers from "./assignment-headers";
import actions from "./assignment-actions";
import initialState from "./assignment-initialize";
import reducer from "./assignment-reducer";
import convertISOToYMD from "../../utils/dateUtils";

export default function Assignments() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [groupName, setGroupName] = useState("");

  const handleModify = (id) => {
    // const record = assignment.filter((row) => row[0] === id);
    // console.log(record);
    // if (record) {
    //   const [, ...exercise] = record;
    //   setTitle(exercise[0]);
    //   setDescription(exercise[1]);
    //   setWordsAmount(exercise[2]);
    // }
  };

  const handleExerciseDetails = (id) => {
    dispatch({
      type: actions.openGroupModal,
      payload: { openGroup: true },
    });
    console.log(id);
    console.log(state);
  };

  const handleGroupDetails = (id) => {
    dispatch({
      type: actions.openGroupModal,
      payload: { openGroup: true },
    });
    console.log(id);
    console.log(state);
    const group = state.groups.find((group) => group.group_id === id);
    if (group) {
      console.log(group.name);
      setGroupName(group.name);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const assignment = {
      due_date: state.assignment.dueDate,
      exercise_id: state.assignment.exercise.id,
      group_id: state.assignment.group.id,
    };
    fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignment),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        // arreglar aqui
        dispatch({
          type: actions.setAssignment,
          payload: {
            assignment: {
              group: { id: null, text: "" },
              dueDate: "",
              exercise: { id: null, text: "" },
            },
          },
        });
        dispatch({
          type: actions.openAssignmentModal,
          payload: { openAssignment: false },
        });
        dispatch({
          type: actions.setAssignments,
          payload: {
            assignments: [
              ...state.assignments,
              [
                data.assignment.assignment_id,
                {
                  id: assignment.exercise_id,
                  text: data.assignment.exercise_name,
                  onClick: (e) => handleExerciseDetails(assignment.exercise_id),
                },
                {
                  id: assignment.group_id,
                  text: data.assignment.group_name,
                  onClick: (e) => handleExerciseDetails(assignment.group_id),
                },
                assignment.due_date,
              ],
            ],
          },
        });
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/assignments/${id}`, {
      method: "DELETE",
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
        if (data.message === "Assignment deleted!") {
          // setExercises(exercises.filter((exercise) => exercise[0] !== id));
          dispatch({
            type: actions.setAssignments,
            payload: {
              assignments: state.assignments.filter(
                (assignment) => assignment[0] !== id
              ),
            },
          });
        }
      });
  };

  useEffect(() => {
    const professorId = 1;
    fetch(`http://localhost:5000/api/assignments?professor_id=${professorId}`, {
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
        const assignments = data.map((assignment) => {
          return [
            assignment.assignment_id,
            {
              id: assignment.exercise.exercise_id,
              text: assignment.exercise.title,
              onClick: (e) =>
                handleExerciseDetails(assignment.exercise.exercise_id),
            },
            {
              id: assignment.group.group_id,
              text: assignment.group.group_name,
              onClick: (e) => handleGroupDetails(assignment.group.group_id),
            },
            convertISOToYMD(assignment.due_date),
          ];
        });
        dispatch({
          type: actions.setAssignments,
          payload: { assignments: [...assignments] },
        });
      })
      .catch((error) => console.log(error));
  }, []);

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
        const exercises = data.map((exercise) => ({
          exercise_id: exercise.exercise_id,
          name: exercise.title,
        }));
        dispatch({
          type: actions.setExercises,
          payload: {
            exercises: [...exercises],
          },
        });
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const professorId = 1;
    fetch(`http://localhost:5000/api/groups?professor_id=${professorId}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok && response.status !== 404) {
          return response.json();
        }
      })
      .then((data) => {
        if (data?.groups) {
          dispatch({
            type: actions.setGroups,
            payload: {
              groups: [...data.groups],
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Grid container spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={"/"}>Inicio</Link>
        <Typography color="textPrimary">Tareas</Typography>
      </Breadcrumbs>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Crear una nueva tarea</Title>
          <ModalForm
            buttonTitle="grupo"
            title={groupName}
            open={state.openGroup}
            setOpen={(openGroup) =>
              dispatch({
                type: actions.openGroupModal,
                payload: { openGroup: openGroup },
              })
            }
            showButton={false}
          >
            algo
          </ModalForm>

          <ModalForm
            buttonTitle="Crear"
            title="Crear Tarea"
            open={state.openAssignment}
            setOpen={(openAssignment) =>
              dispatch({
                type: actions.openAssignmentModal,
                payload: { openAssignment: openAssignment },
              })
            }
          >
            <FormGroup className={classes.formGroup}>
              <InputLabel id="demo-simple-select-label">Ejercicio</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.assignment.exercise.id}
                onChange={(e) => {
                  const exercise = state.exercises.find(
                    (exercise) => exercise.exercise_id === e.target.value
                  );
                  console.log(exercise);
                  dispatch({
                    type: actions.setExercise,
                    payload: {
                      exercise: { id: e.target.value, text: exercise.name },
                    },
                  });
                }}
              >
                {state.exercises.map((exercise) => (
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
                value={state.assignment.group.id}
                onChange={(e) => {
                  const group = state.groups.find(
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
                {state.groups.map((group) => (
                  <MenuItem
                    value={group.group_id}
                    key={`group-${group.group_id}`}
                  >
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
                value={state.dueDate}
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
                startIcon={<SaveIcon />}
                type="submit"
                onClick={(e) =>
                  dispatch({
                    type: actions.openAssignmentModal,
                    payload: { openAssignment: false },
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
            title="Tareas"
            headers={headers}
            rows={state.assignments}
            resource="assignments"
            handleModify={handleModify}
            handleDelete={handleDelete}
            showActions={true}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
