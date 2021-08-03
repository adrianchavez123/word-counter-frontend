import React, { useEffect } from "react";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chart from "../Chart";
import Deposits from "../Card/";
import Table from "../../Table";
import useStyles from "../../Hooks/useStyles/useStyles";

const headers = [
  "Tarea",
  "Fecha de Entrega Máxima",
  "Cantidad de Tareas Recibidas",
];
export default function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  useEffect(() => {
    const professor_id = 1;
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
        if (data) {
          console.log(data);
          // dispatch({
          //   type: actions.setDeliver,
          //   payload: {
          //     student: `${results.student.username}(${results.student.student_id})`,
          //     assignment: `${results.exercise.title}`,
          //     arriveAt: convertISOToYMD(results.arrive_at),
          //     totalWordsDetected: results.total_words_detected,
          //     dueDate: convertISOToYMD(results.assignment.due_date),
          //     exerciseId: results.exercise.exercise_id,
          //   },
          // });
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">Inicio</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Table
            title="Ultimas Tareas"
            headers={headers}
            showActions={false}
            rows={[
              [1, "Leer lectura el cuento más contado", "2021-08-03", 5],
              [
                2,
                "Leer lectura de la página 189 del libro de lecturas",
                "2021-08-10",
                3,
              ],
              [
                2,
                "Leer lectura de la página 20 del libro de lecturas",
                "2021-08-15",
                0,
              ],
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
