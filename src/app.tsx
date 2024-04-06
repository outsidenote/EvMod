import * as React from 'react';
import { createRoot } from 'react-dom/client';
import MainLayout from './components/MainLayout';
import ViewElement from './components/ViewElement';
import AddElement from './components/AddElement';
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import '../src/assets/style.css';

const router = createMemoryRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: (<div>Home Page</div>) },
      { path: 'view-element', element: <ViewElement /> },
      { path: 'add-element', element: (<AddElement />) },
    ]

  }
]);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}