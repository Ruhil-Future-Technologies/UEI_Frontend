import { render } from "@testing-library/react";
import React from "react";
import Menu from "../Menu";
import NameContext from "../../Context/NameContext";
import { MemoryRouter } from "react-router-dom";
import { contextValue } from "../../../MockStorage/mockstorage";

describe("Menu Component", () => {
  const renderComponent = (initialEntries = ["/"]) => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter initialEntries={initialEntries}>
          <Menu />
        </MemoryRouter>
      </NameContext.Provider>
    );
  };

  it("should render Menu component", () => {
    const { getByTestId } = renderComponent(["/menu"]); // Provide a specific route if necessary
    expect(getByTestId("menu_text")).toBeInTheDocument();
    // expect(getByTestId("menu_btn")).toBeInTheDocument();
  });
});
