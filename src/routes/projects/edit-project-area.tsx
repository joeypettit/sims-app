import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getAreaTemplate } from "../../api/api";
import ProjectAreaProposal from "../projects/project-area-proposal";
import PanelHeaderBar from "../../components/page-header-bar";

export default function EditProjectArea() {
  const { areaId } = useParams();
  console.log("area is", areaId);

  return (
    <>
      <PanelHeaderBar />
      <ProjectAreaProposal areaId={areaId} />
    </>
  );
}
