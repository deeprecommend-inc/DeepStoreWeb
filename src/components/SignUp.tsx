import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "./Copyright";
import { useState } from "react";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const SignUp = () => {
  const [canSubmit, setCanSubmit] = useState(true);
  const [msg, setMsg] = useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const blankRegex = /^(?=\s*$)/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    event.preventDefault();
    if (blankRegex.test(name)) {
      // name is blank
      // TODO: display an error message
    } if (!emailRegex.test(email)) {
      // email is invaild
      // TODO: display an error messaage
    } else if (password.length < 8) {
      // password is too short
      // TODO: display an error messaage
    } else {
      const url = `${process.env.API_ROOT}/auth/register`
      setCanSubmit(false);
      setMsg("送信しています..")
      const abort = new AbortController();
      const onError = (msg: string = "送信中にエラーが発生しました") => {
        setMsg(msg);
        setCanSubmit(true);
      }
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, email, password}),
        signal: abort.signal
      }).then(e => {
        switch (e.status) {
        case 200:
          setMsg(`${email}に認証リンクを送信しました`);
          return;
        case 500: // bad request
          setMsg(`すでに${email}で登録されています`);
          return;
        default:
           onError();
           return;
        }
      }).catch(onError);
      return () => {abort.abort();setMsg("");setCanSubmit(true)}
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  label="名前"
                  required
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="new-password"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!canSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <p>{msg}</p>
    </ThemeProvider>
  );
};
