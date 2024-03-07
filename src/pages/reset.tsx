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
import { Copyright } from "@/components/Copyright";
import { useState } from "react";
import { useRouter } from "next/router";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
enum Status {
    verifying,
    failed,
    success
}

export default function ResetPage() {
    const router = useRouter();
    const token = router.asPath.split("#")[1];
    const canSubmit = useState(true);
    const [status, setStatus] = useState(Status.verifying);
    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get("password") as string;
        fetch(`${process.env.API_ROOT}/auth/reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token, password}),
        }).then(res => {
            switch (res.status) {
                case 200:
                    alert("パスワードをリセットできました")
                    router.push("/");
                    return;
                default: 
                    alert("トークンが不正です。もう一度トークンを発行してください")
            }
        })
    };
    return <ThemeProvider theme={defaultTheme}>
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
            パスワードを再発行する
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
}