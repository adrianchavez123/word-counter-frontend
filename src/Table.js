import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./components/Title";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function CustomTable({
  title,
  headers = [],
  rows = [],
  showActions = false,
  handleModify,
  handleDelete,
}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.length >= 0 &&
              headers.map((thead) => (
                <TableCell key={thead}>{thead}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const [id, ...values] = row;
            return (
              <TableRow key={`${id}-${Math.random()}`}>
                {values.map((value) =>
                  value && typeof value === "object" ? (
                    <TableCell
                      key={`${id}-${value.id}-${value.text}-${Math.random()}`}
                    >
                      <Link component="button" onClick={value.onClick}>
                        {value.text}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell key={`${id}-${value}-${Math.random()}`}>
                      {value}
                    </TableCell>
                  )
                )}
                {showActions ? (
                  <TableCell>
                    <label
                      htmlFor="icon-button-file"
                      style={{ marginRight: "1rem" }}
                    >
                      <IconButton
                        color="primary"
                        aria-label="modify an exercise"
                        component="span"
                        onClick={(e) => handleModify(id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="delete an exercise"
                        component="span"
                        onClick={(e) => handleDelete(id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </label>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ver tareas anteriores
        </Link>
      </div>
    </React.Fragment>
  );
}
