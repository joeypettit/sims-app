import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { ProjectArea } from "../../app/types/project-area";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";
import Button from "../../components/button";
import { useState } from "react";
import ConfirmCancelModal from "../../components/confirm-cancel-modal";

export default function SettingsPanel() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      return { blah: "blahblah" };
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  //   const createAreaTemplate = useMutation({
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

  return (
    <PanelWindow>
      <h1>Settings</h1>
      <div>
        <div className="flex flex-row bg-sims-green-100">
          <h2>Templates</h2>
          <Button
            size="xs"
            variant="primary"
            // onClick={() => navigate("/settings/add-template")}
            onClick={() => setModalOpen(true)}
          >
            +
          </Button>
        </div>
      </div>
      <ConfirmCancelModal
        isOpen={isModalOpen}
        title="Please give your template a name."
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="templateName" className="block mb-2">
            Template Name:
          </label>
          <input
            type="text"
            id="templateName"
            name="templateName"
            required
            className="w-full p-2 border rounded-md mb-4"
          />
        </div>
      </ConfirmCancelModal>
    </PanelWindow>
  );
}
