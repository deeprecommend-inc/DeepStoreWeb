import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://kaitori-daikichi-hatsushiba.jp/">
        kaitori-daikichi-hatsushiba.jp
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
