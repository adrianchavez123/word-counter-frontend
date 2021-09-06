import React, { useEffect, useReducer } from "react";
import { useHistory, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import actions from "./student-actions";
import convertISOToYMD from "../../utils/dateUtils";
import Table from "../../Table";
import studentInitialize from "./student-initialize";
import studentReducer from "./student-reducer";
import headers from "./student-headers";
import { useAuth } from "../../contexts/AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Alumnos() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(studentReducer, studentInitialize);
  let history = useHistory();
  const { currentUser } = useAuth();

  const handleChange = (event) => {
    dispatch({
      type: actions.setStudentsSelected,
      payload: { studentsSelected: event.target.value },
    });
  };

  const handleAssignmentDetails = (deliver) => {
    const { deliver_assignment_id } = deliver;
    history.push(`/resumen-tarea/${deliver_assignment_id}`);
  };

  const getStudentsDelivers = (deliver) => {
    return [
      deliver.deliver_assignment_id,
      {
        id: deliver.student.student_id,
        text: deliver.student.username,
        onClick: () => handleAssignmentDetails(deliver),
      },
      deliver.exercise.title,
      convertISOToYMD(deliver.arrive_at),
    ];
  };
  const handleSearchStudentsAssignments = () => {
    const professor_id = currentUser.uid;
    const studentsSelectedIds = state.studentsSelected.map((student) =>
      Number(student.substring(student.indexOf("(") + 1, student.length - 1))
    );
    fetch(
      `http://localhost:5000/api/deliver-assignments?professor_id=${professor_id}`,
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
        dispatch({
          type: actions.showDelivers,
          payload: {
            showDelivers: true,
          },
        });
        if (data) {
          if (!studentsSelectedIds || studentsSelectedIds.length === 0) {
            return dispatch({
              type: actions.getStudentsDelivers,
              payload: {
                studentsDelivers: data.map(getStudentsDelivers),
              },
            });
          }
          const studentsSelectedDelivers = data.filter((deliverAssignment) =>
            studentsSelectedIds.includes(deliverAssignment.student.student_id)
          );
          const studentsDelivers =
            studentsSelectedDelivers.map(getStudentsDelivers);
          return dispatch({
            type: actions.getStudentsDelivers,
            payload: { studentsDelivers: [...studentsDelivers] },
          });
        } else {
          dispatch({
            type: actions.setStudentsSelected,
            payload: {
              studentsSelected: [],
            },
          });
        }
      })
      .catch((error) => console.log(error));
  };
  const handleModify = () => {};
  const handleDelete = () => {};

  useEffect(() => {
    const professor_id = currentUser.uid;
    fetch(`http://localhost:5000/api/students?professor_id=${professor_id}`, {
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
        if (data) {
          dispatch({
            type: actions.setStudents,
            payload: {
              students: [...data],
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, [currentUser.uid]);
  return (
    <Grid container spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={"/"}>Inicio</Link>
        <Typography color="textPrimary">Alumnos</Typography>
      </Breadcrumbs>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Alumnos</Title>

          <InputLabel id="demo-mutiple-checkbox-label">
            Alumnos (Identificator)
          </InputLabel>
          <div className={classes.studentForm}>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={state.studentsSelected}
              onChange={handleChange}
              input={<Input />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {state.students.map((student) => (
                <MenuItem
                  key={student.student_id}
                  value={`${student.username} (${student.student_id})`}
                >
                  <Checkbox
                    checked={
                      state.studentsSelected.indexOf(
                        `${student.username} (${student.student_id})`
                      ) > -1
                    }
                  />
                  <ListItemText
                    primary={`${student.username} (${student.student_id})`}
                  />
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchStudentsAssignments}
            >
              Buscar
            </Button>
          </div>
        </Paper>
      </Grid>
      {state.showDelivers ? (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Table
              title="Tareas"
              headers={headers}
              rows={state.studentsDelivers}
              resource="deliver-assignments"
              handleModify={handleModify}
              handleDelete={handleDelete}
              showActions={false}
            />
          </Paper>
        </Grid>
      ) : null}
    </Grid>
  );
}
