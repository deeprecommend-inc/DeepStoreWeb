import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { color } from "../constants/const";
import { ReservationCalendar } from "./Calendar";
import { Qr } from "./Qr";
import { useEffect, useState } from "react";
import { SettingsSuggestRounded } from "@mui/icons-material";
import useToken from "@/hooks/useToken";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://kaitori-daikichi-hatsushiba.jp/">
        kaitori-daikichi.jp
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface User {
  name: string;
  pid: string;
  email: string;
}

export const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useToken();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const url = `${process.env.API_ROOT}/user/current`
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }}).then(res => {
        switch (res.status) {
          case 200:
            res.json().then(data => setUser(data))
        }
      })
  }, [token]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" sx={{ boxShadow: "none" }} open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
              backgroundColor: color.blue,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              出張買取予約 大吉初芝駅前店
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              {/* TODO: Login
                 {isLogin ? (
                 <IconButton color="inherit">
                   <Badge badgeContent={4} color="secondary">
                     <NotificationsIcon />
                   </Badge>
                 </IconButton>
                 <Button variant="text">予約する</Button>
              ) : (
               <Button variant="text">ユーザー登録</Button>
                <Button variant="text">ログイン</Button>
              )} */}
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              { user == null ? 
              <>
              <Button
                variant="text"
                sx={{ color: "white" }}
                onClick={() => {
                  router.push("/signup");
                }}
              >
                ユーザー登録
              </Button>
              <Button
                variant="text"
                sx={{ color: "white" }}
                onClick={() => {
                  router.push("/login");
                }}
              >
                ログイン
              </Button></>
              : <>
              <Button variant="text" sx={{color:"white"}}>
                {user.name}
              </Button>
              <Button
                variant="text"
                sx={{ color: "white" }}
                onClick={() => setToken("")}>
                  ログアウト
                </Button>
              </>}
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Qr />
            <ReservationCalendar />
          </Container>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
