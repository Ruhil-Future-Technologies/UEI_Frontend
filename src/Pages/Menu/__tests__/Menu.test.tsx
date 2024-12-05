// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { render, screen, fireEvent } from '@testing-library/react';


// import Menu from '../Menu';
// import React from 'react';
// import { mockStorage } from '../../../MockStorage/mockstorage';

// const mockedUsedNavigate = jest.fn();
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useLocation: () => ({
//     pathname: "localhost:3000/main/Menu"
//   }),
//   useNavigate: () => mockedUsedNavigate,
// }));
// describe('Menu Table Component', () => {
//   beforeEach(() => {
//     global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key])
//   })
//   test('Should render table without error', () => {

//     render(
//       <Menu />
//     )
//     const container = screen.getByTestId('menu-container')
//     expect(container).toBeInTheDocument()
//   })

//   test('Should render table add menu button without error', () => {
//     render(
//       <Menu />
//     )
//     const container = screen.getByTestId('menu-container')
//     expect(container).toBeInTheDocument()
//     const addBtn = screen.getByTestId('add-menu')
//     expect(addBtn).toBeInTheDocument()
//     fireEvent.click(addBtn)
//   })
 


// })
test('dummy test', () => {});