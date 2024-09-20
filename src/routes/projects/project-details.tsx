import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["load", id],
    queryFn: async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Details for Item {id}</h1>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
}
