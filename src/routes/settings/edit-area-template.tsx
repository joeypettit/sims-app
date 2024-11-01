import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { ProjectArea } from "../../app/types/project-area";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";
import Button from "../../components/button";
import { getAllGroupCategories } from "../../api/api";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";

export default function EditAreaTemplate() {
  const navigate = useNavigate();
  const { templateId } = useParams();

  const categoriesQuery = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const result = await getAllGroupCategories();
      return result;
    },
  });

  const areaTemplateQuery = useQuery({
    queryKey: ["area-template", templateId],
    queryFn: async () => {
      console.log("templateid is", templateId);
      const result = await getAllGroupCategories();
      return result;
    },
  });

  // const upsertTemplateMutation = useMutation({
  //   mutationFn: addTodo,
  //   onMutate: (variables) => {
  //     // A mutation is about to happen!

  //     // Optionally return a context containing data to use when for example rolling back
  //     return { id: 1 };
  //   },
  //   onError: (error, variables, context) => {
  //     // An error happened!
  //     console.log(`rolling back optimistic update with id ${context.id}`);
  //   },
  //   onSuccess: (data, variables, context) => {
  //     // Boom baby!
  //   },
  //   onSettled: (data, error, variables, context) => {
  //     // Error or success... doesn't matter!
  //   },
  // });

  if (categoriesQuery.isLoading) {
    return (
      <PanelWindow>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </PanelWindow>
    );
  }

  if (categoriesQuery.isError) {
    return <p>Error: {categoriesQuery.error.message}</p>;
  }
  return (
    <PanelWindow>
      <form>
        <label htmlFor="name">Template Name:</label>
        <input type="text" id="name" name="name" required />
      </form>
      {/* {data?.map((category) => {
        return (
          <div key={category.id}>
            <h2 className="text-md font-bold text-center bg-sims-green-50 rounded-sm">
              {category.name}
            </h2>
            <Button size="sm" variant="primary">
              + Add Group
            </Button>
          </div>
        );
      })} */}
    </PanelWindow>
  );
}
