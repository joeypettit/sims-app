import { createBrowserRouter } from "react-router-dom";
import TerrierProNavBar from "./nav/navbar.tsx";
import ErrorPage from "./error-page.tsx";
import ProjectsPanel from "../routes/projects/projects-panel.tsx";
import ProjectDetails from "../routes/projects/project-details.tsx";

function determineRouter() {
  // in future, I could use the domain name to conditionally return
  // different routers for different applications
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <TerrierProNavBar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/projects",
        element: <ProjectsPanel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/projects/:id",
        element: <ProjectDetails />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
