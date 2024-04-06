import * as React from 'react';
import { createRoot } from 'react-dom/client';
import MainLayout from './components/MainLayout';
import SelectionDetails from './components/SelectionDetails';
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import '../src/assets/style.css';

const router = createMemoryRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: (<div>Home Page</div>) },
      { path: 'view-element', element: <SelectionDetails /> },
      { path: 'add-element', element: (<div>Add Element</div>) },
    ]

  }
]);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}