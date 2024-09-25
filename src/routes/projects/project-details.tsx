import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";

export default function ProjectDetails() {
  const { id } = useParams();

  // function getTestProjectData() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const thisProject = testData.find((p) => p.projectId == id);
  //       console.log("this project", thisProject);
  //       resolve(thisProject);
  //     }, 2000); // Simulate a 2-second API delay
  //   });
  // }

  // Fetch the details for the specific item using the ID from the route params
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["project", id],
  //   queryFn: async () => {
  //     const response = (await getTestProjectData()) as Project;
  //     return response;
  //   },
  // });

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (isError) {
  //   return <p>Error: {error.message}</p>;
  // }

  return (
    <div>
      <h1>Details for Item {id}</h1>
      {/* <h2>{data?.}</h2>
      <p>{data?.projectAddress.city}</p> */}
    </div>
  );
}
