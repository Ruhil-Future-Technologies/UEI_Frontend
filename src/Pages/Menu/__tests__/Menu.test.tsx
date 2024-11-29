/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';


import Menu from '../Menu';
import React from 'react';


const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/main/Menu"
  }),
  useNavigate: () => mockedUsedNavigate,
}));
describe('Menu Table Component', () => {
  const mockStorage: any = {
    menulist1: JSON.stringify([
      {
        created_at: "Tue, 11 Jun 2024 12:15:27 GMT",
        form_data: {
          form_url: "/main/SuperAdmin",
          is_save: true,
          is_search: true,
          is_update: true
        },
        id: 23,
        is_active: 1,
        is_deleted: false,
        menu_name: "Menu",
        priority: 1,
        submenus: [
          {
            created_at: "Mon, 24 Jun 2024 09:58:08 GMT",
            id: 56,
            is_active: 1,
            is_deleted: false,
            menu_master_id: 23,
            menu_master_name: "User Authorization",
            menu_name: "Menu",
            priority: 2,
            updated_at: "Mon, 24 Jun 2024 13:37:35 GMT"
          },
        ],
        updated_at: "Fri, 14 Jun 2024 07:40:04 GMT"
      },
      {
        created_at: "Tue, 11 Jun 2024 12:15:27 GMT",
        form_data: {
          form_url: "/main/SuperAdmin",
          is_save: true,
          is_search: true,
          is_update: true
        },
        id: 24,
        is_active: 1,
        is_deleted: false,
        menu_name: "Submenu",
        priority: 1,
        submenus: [
          {
            created_at: "Mon, 24 Jun 2024 09:58:08 GMT",
            id: 57,
            is_active: 1,
            is_deleted: false,
            menu_master_id: 24,
            menu_master_name: "User Authorization",
            menu_name: "Submenu",
            priority: 2,
            updated_at: "Mon, 24 Jun 2024 13:37:35 GMT"
          },
        ],
        updated_at: "Fri, 14 Jun 2024 07:40:04 GMT"
      }
    ])
  }
  beforeEach(() => {
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key])
  })
  test('Should render table without error', () => {

    render(
      <Menu />
    )
    const container = screen.getByTestId('menu-container')
    expect(container).toBeInTheDocument()
  })

  test('Should render table add menu button without error', () => {
    render(
      <Menu />
    )
    const container = screen.getByTestId('menu-container')
    expect(container).toBeInTheDocument()
    const addBtn = screen.getByTestId('add-menu')
    expect(addBtn).toBeInTheDocument()
    fireEvent.click(addBtn)
  })
 


})