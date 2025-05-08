import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"; // Removed 'Theme' import

const primaryColor = "#9943ec"; 

const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkMode: false,
  theme: createTheme(),
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProviderWrapper");
  }
  return context;
};

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // default to light if not set
    const stored = localStorage.getItem("isDarkMode");
    return stored === "true"; // or false if nothing is stored
  });
  
  
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("isDarkMode", String(isDarkMode));
  }, [isDarkMode]);
  
  

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: primaryColor,
        light: "#b26bef",
        dark: "#6f1ec4",
      },
      secondary: {
        main: "#4caf50",
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#1e1e1e" : "#f5f5f5",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#000000",
        secondary: isDarkMode ? "#b0bec5" : "#757575",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            // Required to avoid white flash on autofill
            WebkitTextSizeAdjust: "100%",
          },
          "input:-webkit-autofill": {
            WebkitBoxShadow: `${isDarkMode ? "0 0 0 1000px #32363b" : "0 0 0 1000px #fff"} inset !important`,
            boxShadow: `${isDarkMode ? "0 0 0 1000px #32363b" : "0 0 0 1000px #fff"} inset !important`,
            WebkitTextFillColor: `${isDarkMode ? "#fff" : "#000"} !important`,
            caretColor: `${isDarkMode ? "#fff" : "#000"} !important`,
            transition: "background-color 5000s ease-in-out 0s",
          },
        },
      },

  
      
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "4px",
            
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",            
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
            "& .MuiMenuItem-root": {
              backgroundColor: isDarkMode ? "#333" : "#fff",
              "&:hover": {
                backgroundColor: isDarkMode ? "#444" : "#f0f0f0",
              },
            },
          },
        },
      },

      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#212529" : "#ffffff",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            color: isDarkMode ? "#ffffff" : "#212529",
            backgroundColor: isDarkMode ? "#212529" : "#ffffff",
            borderBottom: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
          },
          head: {
            color: isDarkMode ? "#dddddd" : "#212529",
            backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5",
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(odd)": {
              backgroundColor: isDarkMode ? "#212121" : "#fafafa",
            },
            "&:hover": {
              backgroundColor: isDarkMode ? "#333333" : "#f0f0f0",
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#212529" : "#ffffff",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#212529" : "#ffffff",
            borderRadius: "8px",
            boxShadow: isDarkMode
              ? "0 0 0 1px rgba(255,255,255,0.05)"
              : "0 0 4px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
