import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import FAQ from "../FAQ";
import { ThemeProvider } from "@emotion/react";
import React from "react";

describe("FAQ Component", () => {
  // Setup theme mock if needed, you can use a default theme here
  const mockThemeMode = "light";

  it("should render FAQ component", () => {
    render(
      <Router>
        <ThemeProvider theme={{ mode: mockThemeMode }}>
          <FAQ />
        </ThemeProvider>
      </Router>
    );

    // Check if the FAQ header is present
    expect(screen.getByText("Frequently asked questions (FAQ)")).toBeInTheDocument();

    // Check for an accordion item in the FAQ component
    expect(screen.getByText("Just once I'd like to eat dinner with a celebrity?")).toBeInTheDocument();
  });

  it("should toggle the accordion when clicked", () => {
    render(
      <Router>
        <ThemeProvider theme={{ mode: mockThemeMode }}>
          <FAQ />
        </ThemeProvider>
      </Router>
    );

    // Initially, the accordion item should be expanded
    const firstAccordionButton = screen.getByText("Just once I'd like to eat dinner with a celebrity?");
    expect(firstAccordionButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should display the ThemeSidebar", () => {
    render(
      <Router>
        <ThemeProvider theme={{ mode: mockThemeMode }}>
          <FAQ />
        </ThemeProvider>
      </Router>
    );

    // Check if the ThemeSidebar is rendered
    expect(screen.getByTestId("theme-sidebar")).toBeInTheDocument();
  });
});
