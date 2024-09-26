import { createBrowserRouter } from "react-router-dom";
import TerrierProNavBar from "./nav/navbar.tsx";
import ErrorPage from "./error-page.tsx";
import ProjectsPanel from "../routes/projects/projects-panel.tsx";
import ProjectDetails from "../routes/projects/project-details.tsx";
import ProjectAreaProposal from "../routes/projects/project-area-proposal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TerrierProNavBar />,
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
    ],
  },
]);

export default router;
