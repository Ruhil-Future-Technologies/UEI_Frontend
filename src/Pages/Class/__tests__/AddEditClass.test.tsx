import React from "react";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import AddEditClass from "../AddEditClass";

describe("Add Edit class page",()=>{
    const renderComponent=()=>{
   return render( <NameContext.Provider value={contextValue}>
    <MemoryRouter>
        <AddEditClass
        />
    </MemoryRouter>
</NameContext.Provider>)
    }

   it("should render addEditcall component page",()=>{
    const {asFragment}=renderComponent();
    expect(asFragment).toMatchSnapshot();
   })
})