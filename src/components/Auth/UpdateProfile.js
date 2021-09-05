import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";

export default function UpdateProfile() {
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { updateMyPassword, updateEmailAddress, currentUser, updateMyProfile } =
    useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Las contraseñas no coinciden");
    }

    const promises = [];
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmailAddress(emailRef.current.value));
    }

    if (
      nameRef.current.value &&
      nameRef.current.value !== currentUser.displayName
    ) {
      promises.push(updateMyProfile({ displayName: nameRef.current.value }));
    }
    if (passwordRef.current.value) {
      promises.push(updateMyPassword(passwordRef.current.value));
    }
    setError("");
    setLoading(true);
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        setError("Fallo actualizar tu perfile, por favor intentalo más tarde.");
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={classes.authContainer}>
      <Card className={classes.authRoot} variant="outlined">
        <CardContent>
          <Title>Actualizar perfil</Title>
          {error && <span className={classes.failureText}>{error}</span>}
          <form onSubmit={handleSubmit}>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="name"
                label="Nombre"
                type="text"
                inputRef={nameRef}
                defaultValue={
                  currentUser?.displayName && currentUser.displayName
                }
              />
            </FormGroup>

            <FormGroup className={classes.formGroup}>
              <TextField
                id="email"
                label="Correo Electrónico"
                type="email"
                inputRef={emailRef}
                required
                defaultValue={currentUser?.email && currentUser.email}
              />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="password"
                label="contraseña"
                type="password"
                inputRef={passwordRef}
              />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="password"
                label="Confirmar contraseña"
                type="password"
                inputRef={passwordConfirmRef}
              />
            </FormGroup>

            <div style={{ paddingTop: "1rem" }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                Actualizar
              </Button>
            </div>
            {loading && (
              <div className={classes.loadingContainer}>
                {" "}
                <CircularProgress />
              </div>
            )}
          </form>
        </CardContent>
        <CardActions>
          <Link to="/login">Cancelar</Link>
        </CardActions>
      </Card>
    </div>
  );
}
