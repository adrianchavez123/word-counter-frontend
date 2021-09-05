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

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleCreateUser = async () => {
    if (currentUser.uid) {
      const professor = {
        professor_id: currentUser.uid,
        username: currentUser.displayName,
        name: currentUser.displayName,
        email: currentUser.email,
      };
      const respose = await fetch("http://localhost:5000/api/professors", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(professor),
      });
      return await respose.json();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Las contraseñas no coinciden.");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);

      const professor = await handleCreateUser();
      if (professor.message.includes("Professor created successfully")) {
        history.push("/");
      }
    } catch (e) {
      setError(
        "Fallo el registro de tu cuenta, por favor revisa que tu correo esta correcto."
      );
    }
    setLoading(false);
  };
  return (
    <div className={classes.authContainer}>
      <Card className={classes.authRoot} variant="outlined">
        <CardContent>
          <Title>Registar</Title>
          {error && <span className={classes.failureText}>{error}</span>}
          <form onSubmit={handleSubmit}>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="email"
                label="Correo Electrónico"
                type="email"
                inputRef={emailRef}
                required
              />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="password"
                label="contraseña"
                type="password"
                inputRef={passwordRef}
                required
              />
            </FormGroup>

            <FormGroup className={classes.formGroup}>
              <TextField
                id="password"
                label="Confirmar contraseña"
                type="password"
                inputRef={passwordConfirmRef}
                required
              />
            </FormGroup>
            <div style={{ paddingTop: "1rem" }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                Registrar
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
          Ya cuentas con una cuenta? <Link to="/login">Iniciar sesión</Link>
        </CardActions>
      </Card>
    </div>
  );
}
