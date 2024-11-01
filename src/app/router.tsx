import { createBrowserRouter } from "react-router-dom";
import NavBar from "./nav/navbar.tsx";
import ErrorPage from "./error-page.tsx";
import ProjectsPanel from "../routes/projects/projects-panel.tsx";
import ProjectDetails from "../routes/projects/project-details.tsx";
import ProjectAreaProposal from "../routes/projects/project-area-proposal.tsx";
import SettingsPanel from "../routes/settings/settings.tsx";
import EditAreaTemplate from "../routes/settings/edit-area-template.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/project",
        element: <ProjectsPanel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/project/:id",
        element: <ProjectDetails />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/project/:id/area/:areaId",
        element: <ProjectAreaProposal />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/settings",
        element: <SettingsPanel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/settings/edit-template/:templateId",
        element: <EditAreaTemplate />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
