import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import Header from "../index";
import NameContext from '../../../Pages/Context/NameContext';
import { contextValue } from "../../../MockStorage/mockstorage";
import { BrowserRouter as Router } from 'react-router-dom';

const mockNavigate = jest.fn();
beforeEach(() => {
  global.speechSynthesis = {
    cancel: jest.fn(),
    speak: jest.fn(),
    // Add other necessary methods if used in the component
  } as unknown as SpeechSynthesis;

  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "theme") return "light";
    return null;
  });
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  localStorage.clear = jest.fn();
  sessionStorage.clear = jest.fn();
  // (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


describe("Header Component", () => {

  const renderComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
      <Router>
      <Header />
      </Router>
    </NameContext.Provider>
    );
  };


  it("toggles theme on button click", () => {
    const { getByTestId } = renderComponent();

    const themeToggleButton = getByTestId("theme-toggle");
    expect(themeToggleButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(themeToggleButton);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });
  
  it("displays notifications dropdown", () => {
    const {  getByTestId } = renderComponent();

    const notificationsButton = getByTestId("notifications-toggle");
    expect(notificationsButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(notificationsButton);
    });

    const notificationsDropdown = getByTestId("notifications-dropdown");
    expect(notificationsDropdown).toBeVisible();
  });

  it("logs out and clears localStorage and sessionStorage",async () => {
    const { getByTestId } = renderComponent();

    const logoutButton = getByTestId("logout-btn");
    expect(logoutButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(logoutButton);
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user_type");
    expect(localStorage.removeItem).toHaveBeenCalledWith("userid");
    expect(localStorage.removeItem).toHaveBeenCalledWith("userdata");
    expect(localStorage.removeItem).toHaveBeenCalledWith("signupdata");
    expect(localStorage.removeItem).toHaveBeenCalledWith("_id");
    expect(localStorage.removeItem).toHaveBeenCalledWith("menulist");
    expect(localStorage.removeItem).toHaveBeenCalledWith("menulist1");
    expect(localStorage.removeItem).toHaveBeenCalledWith("proFalg");
    expect(localStorage.removeItem).toHaveBeenCalledWith("loglevel");
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("profileData");
    expect(localStorage.removeItem).toHaveBeenCalledWith("chatsaved");
    expect(localStorage.removeItem).toHaveBeenCalledWith("Profile_completion");
    expect(localStorage.removeItem).toHaveBeenCalledWith("Profile completion");
    expect(localStorage.removeItem).toHaveBeenCalledWith("tokenExpiry");
    expect(global.speechSynthesis.cancel).toHaveBeenCalled();
    await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    expect(contextValue.logoutpro).toHaveBeenCalled();
  });
 

    it("toggles 'toggled' class on body element", () => {
     
      const { getByTestId } = renderComponent();
  
      
  
      const menuIcon = getByTestId("btn-toggle"); // Get the icon element, assuming it's a button
  
      // First click: Add 'toggled' class
      fireEvent.click(menuIcon);
      expect(document.body).toHaveClass("toggled");
  
      // Second click: Remove 'toggled' class
      fireEvent.click(menuIcon);
      expect(document.body).not.toHaveClass("toggled");
    });
    

});
