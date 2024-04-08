import * as React from 'react';
import { createRoot } from 'react-dom/client';
import MainLayout from './components/MainLayout';
import ViewElement from './components/ViewElement';
import AddElement from './components/AddElement';
import EventsCatalog from './components/EventsCatalog';
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import '../src/assets/style.css';
import HomePage from './components/HomePage';

const router = createMemoryRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: 'view-element', element: <ViewElement /> },
      { path: 'add-element', element: (<AddElement />) },
      { path: 'events-catalog', element: (<EventsCatalog />) },
    ]

  }
]);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}