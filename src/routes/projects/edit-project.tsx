import { useState, useEffect } from "react";
import { useLocation, useNavigation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import Button from "../../components/button";

import PanelHeaderBar from "../../components/page-header-bar";
import type { Project } from "../../app/types/project";
import { getProjectById, updateProject } from "../../api/api";
// type LineItemFormData = {
//   name: string;
//   quantity: number;
//   unitId: string;
//   marginDecimal: number;
//   lineItemOptions: OptionFormData[];
// };

// export type OptionFormData = {
//   description: string;
//   highCostInDollarsPerUnit: number;
//   lowCostInDollarsPerUnit: number;
//   exactCostInDollarsPerUnit: number;
//   priceAdjustmentDecimal: number;
//   tier: { name: string; tierLevel: number };
// };

export default function EditProject() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { projectId } = useParams();
  const [formData, setFormData] = useState<Project | undefined>(undefined);

  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw Error("Line Item Id is required.");
      }
      const result = await getProjectById(projectId);
      return result;
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  });

  const updateProjectMutation = useMutation({
    mutationFn: async () => {
      if (formData && projectId) {
        await updateProject({
          projectId: projectId,
          name: formData.name,
          clientFirstName: formData?.clients[0].firstName,
          clientLastName: formData?.clients[0].lastName,
          clientId: formData?.clients[0].id,
          description: formData?.description,
          salesPersonFirstName: formData?.users[0].firstName,
          salesPersonLastName: formData?.users[0].lastName,
          salesPersonId: formData?.users[0].id,
        });
      }
    },
    onError: (error) => {
      console.log("error updating line item", error);
    },
    onSuccess: () => {
      window.history.back();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["all-projects"] }),
  });

  function onClientFirstNameInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    if (formData) {
      const updatedFormData = structuredClone(formData);
      updatedFormData.clients[0].firstName = value;
      setFormData(updatedFormData);
    }
  }

  function onClientLastNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (formData) {
      const updatedFormData = structuredClone(formData);
      updatedFormData.clients[0].lastName = value;
      setFormData(updatedFormData);
    }
  }

  function onSalesPersonFirstNameInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    if (formData) {
      const updatedFormData = structuredClone(formData);
      updatedFormData.users[0].firstName = value;
      setFormData(updatedFormData);
    }
  }

  function onSalesPersonLastNameInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    if (formData) {
      const updatedFormData = structuredClone(formData);
      updatedFormData.users[0].lastName = value;
      setFormData(updatedFormData);
    }
  }

  function onDescriptionInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (formData) {
      const updatedFormData = structuredClone(formData);
      updatedFormData.description = value;
      setFormData(updatedFormData);
    }
  }

  // function validateForm() {
  //   if (!formData) {
  //     throw Error("Form Data is undefined");
  //   }
  //   const validatedFormData = structuredClone(formData);
  //   validatedFormData?.lineItemOptions.forEach((option: LineItemOption) => {
  //     if (option.priceAdjustmentMultiplier == undefined) {
  //       option.priceAdjustmentMultiplier = 1;
  //     }
  //   });
  //   if (validatedFormData?.marginDecimal == undefined) {
  //     validatedFormData.marginDecimal = 0;
  //   }
  //   return validatedFormData;
  // }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateProjectMutation.mutate();
  }

  function handleCancel() {
    setFormData(undefined);
    window.history.back();
  }

  useEffect(() => {
    // prepopulate local state for form
    if (projectQuery.data && !formData) {
      setFormData(projectQuery.data);
    }
  }, [projectQuery.data, formData]);

  if (!formData) {
    return (
      <>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner centered />
        </div>
      </>
    );
  }
  console.log("form data", formData);
  return (
    <>
      <PanelHeaderBar title={`Editing Project: ${projectQuery.data?.name}`} />
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="clientFirstName">Client First Name</label>
              <input
                type="text"
                autoComplete="off"
                id="clientFirstName"
                name="clientFirstName"
                value={formData.clients[0].firstName}
                onChange={onClientFirstNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="clientLastName">Client Last Name</label>
              <input
                type="text"
                autoComplete="off"
                id="clientLastName"
                name="clientLastName"
                value={formData.clients[0].lastName}
                onChange={onClientLastNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          </div>
          <div className="p-2 rounded bg-slate-50">
            <label htmlFor="description">Project Description</label>
            <input
              type="text"
              autoComplete="off"
              id="description"
              name="description"
              value={formData.description}
              onChange={onDescriptionInputChange}
              required
              className="border border-gray-300 p-1 rounded w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="clientFirstName">Sales Person First Name</label>
              <input
                type="text"
                autoComplete="off"
                id="salesPersonFirstName"
                name="salesPersonFirstName"
                value={formData.users[0].firstName}
                onChange={onSalesPersonFirstNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="salesPersonLastName">
                Sales Person Last Name
              </label>
              <input
                type="text"
                autoComplete="off"
                id="salesPersonLastName"
                name="salesPersonLastName"
                value={formData.users[0].lastName}
                onChange={onSalesPersonLastNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <Button variant="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
