import React, { useReducer } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import useStyles from "../../../Hooks/useStyles/useStyles";
import { groupReducer, groupInitialize } from "../";

export default function GroupList({
  group,
  onClose,
  handleRemoveStudent,
  showCloseButton = true,
  removeMembers = false,
}) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(groupReducer, groupInitialize);
  return (
    <>
      <h3>Estudiantes</h3>

      <List style={{ width: "100%", overflow: "auto", maxHeight: 300 }}>
        {group.students.map((student) => (
          <ListItem key={`student-${student.student_id}`}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${student.username}(${student.student_id})`}
            />
            {removeMembers && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    handleRemoveStudent(student.student_id, state, dispatch);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
      {showCloseButton && (
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
      )}
    </>
  );
}
