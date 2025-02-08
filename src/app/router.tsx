import { createBrowserRouter, Navigate } from 'react-router-dom';
import NavBar from './nav/navbar';
import ErrorPage from './error-page';
import PanelWindow from '../components/panel-window';
import ProjectsPanel from '../routes/projects/projects-panel';
import ProjectDetails from '../routes/projects/project-details';
import EditProjectArea from '../routes/projects/edit-project-area';
import SettingsPanel from '../routes/settings/settings';
import EditAreaTemplate from '../routes/settings/edit-area-template';
import EditLineItem from '../routes/settings/edit-line-item';
import EditProject from '../routes/projects/edit-project';
import SpinnerPage from '../components/spinner-page';
import LoginPage from '../routes/login/login-page';
import UsersPanel from '../routes/users/users-panel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <NavBar />,
    errorElement: <PanelWindow><ErrorPage /></PanelWindow>,
    children: [
      {
        path: 'projects',
        element: <PanelWindow><ProjectsPanel /></PanelWindow>
      },
      {
        path: 'project/:id',
        element: <PanelWindow><ProjectDetails /></PanelWindow>
      },
      {
        path: 'project/:id/area/:areaId',
        element: <PanelWindow><EditProjectArea /></PanelWindow>
      },
      {
        path: 'users',
        element: <PanelWindow><UsersPanel /></PanelWindow>
      },
      {
        path: 'settings',
        element: <PanelWindow><SettingsPanel /></PanelWindow>
      },
      {
        path: 'settings/edit-template/:templateId',
        element: <PanelWindow><EditAreaTemplate /></PanelWindow>
      },
      {
        path: 'edit-line-item/:lineItemId',
        element: <PanelWindow><EditLineItem /></PanelWindow>
      },
      {
        path: 'edit-project/:projectId',
        element: <PanelWindow><EditProject /></PanelWindow>
      },
      {
        path: 'spinner-page',
        element: <PanelWindow><SpinnerPage /></PanelWindow>
      }
    ]
  }
]);
