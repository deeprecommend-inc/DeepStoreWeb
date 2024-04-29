import { defaultTheme } from "@/lib/defaultTheme";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
		<ThemeProvider theme={defaultTheme}>
            {children}
        </ThemeProvider>
    );
  }
  