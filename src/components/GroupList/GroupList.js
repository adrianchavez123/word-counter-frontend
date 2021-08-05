import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import useStyles from "../../Hooks/useStyles/useStyles";

export default function GroupList({ group, onClose }) {
  const classes = useStyles();
  return (
    <>
      <h3>Estudiantes</h3>

      <List style={{ width: "100%", overflow: "auto", maxHeight: 300 }}>
        {group.students.map((student) => (
          <ListItem key={`student-${student.student_id}`}>
            <ListItemText
              primary={`Item ${student.username}(${student.student_id})`}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        size="large"
        className={classes.button}
        startIcon={<HighlightOffIcon />}
        type="button"
        onClick={onClose}
        style={{ marginRight: "1rem" }}
      >
        Cerrar
      </Button>
    </>
  );
}
