import { render } from "@testing-library/react";
import React from "react";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import AdminLanguage from "..";

describe("Admin Language component", () => {

    const ActiveForm=2;
    const setActiveForm=jest.fn();

    const renderedComponent = () => {
        return render(
            <NameContext.Provider value={contextValue}>
                <MemoryRouter>
                    <AdminLanguage
                        setActiveForm={setActiveForm}
                        activeForm={ActiveForm}
                    />
                </MemoryRouter>
            </NameContext.Provider>
        );
    };
    
    it("should Admin Language page rendered currectly", () => {
        const { asFragment } = renderedComponent();
        expect(asFragment()).toMatchSnapshot();
    })

    // it("should Admin Language page fields render currecltly", () => {
    //     const { getByLabelText } = renderedComponent();

        
    //     const language=getByLabelText("Language *") as HTMLSelectElement;

    //     const proficiency=getByLabelText("Proficiency *") as HTMLSelectElement;

    //     expect(language.value).toBeInTheDocument();
    //     expect(proficiency.value).toBeInTheDocument();
    // })
})