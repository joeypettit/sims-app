import { createBrowserRouter } from "react-router-dom";
import NavBar from "./nav/navbar.tsx";
import ErrorPage from "./error-page.tsx";
import ProjectsPanel from "../routes/projects/projects-panel.tsx";
import ProjectDetails from "../routes/projects/project-details.tsx";
import ProjectAreaProposal from "../routes/projects/project-area-proposal.tsx";
import SettingsPanel from "../routes/settings/settings.tsx";
import EditAreaTemplate from "../routes/settings/edit-area-template.tsx";
import EditLineItem from "../routes/settings/edit-line-item.tsx";
import PanelWindow from "../components/panel-window.tsx";
import EditProject from "../routes/projects/edit-project.tsx";
import EditProjectArea from "../routes/projects/edit-project-area.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: (
      <PanelWindow>
        <ErrorPage />
      </PanelWindow>
    ),
    children: [
      {
        path: "/project",
        element: (
          <PanelWindow>
            <ProjectsPanel />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/project/:id",
        element: (
          <PanelWindow>
            <ProjectDetails />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/project/:id/area/:areaId",
        element: (
          <PanelWindow>
            <EditProjectArea />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/settings",
        element: (
          <PanelWindow>
            <SettingsPanel />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/settings/edit-template/:templateId",
        element: (
          <PanelWindow>
            <EditAreaTemplate />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/edit-line-item/:lineItemId",
        element: (
          <PanelWindow>
            <EditLineItem />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
      {
        path: "/edit-project/:projectId",
        element: (
          <PanelWindow>
            <EditProject />
          </PanelWindow>
        ),
        errorElement: (
          <PanelWindow>
            <ErrorPage />
          </PanelWindow>
        ),
      },
    ],
  },
]);

export default router;
