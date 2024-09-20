import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelWindow from "../../components/panel-window";
import PanelTable from "../../components/panel-table";
import { useNavigate } from "react-router-dom";
import { Treat } from "../../app/types/treat.type";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/");
      return (await response.json()) as Treat[];
    },
  });

  const handleRowClick = (treat: Treat) => {
    // Navigate to the details page programmatically
    console.log("TREATS");
  };

  const columns: PanelTableColumn<Treat>[] = [
    {
      columnName: "Calories",
      dataObjectKey: "calories",
      orderIndex: 1,
      headerRenderer: () => "Cals",
      // cellRenderer: (treat) => <span>{treat?.name}</span>,
    },
    {
      columnName: "Flavor",
      dataObjectKey: "flavor",
      orderIndex: 1,
      // headerRenderer: () => "THE POST",
      // cellRenderer: (treat) => <span>{treat?.name}</span>,
    },
    { columnName: "Another Thing", cellRenderer: (row) => "Blahblah" },
  ];

  // Mutations
  // const mutation = useMutation({
  //   mutationFn: postTodo,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ["todos"] });
  //   },
  // });
  console.log("data", query);

  return (
    <PanelWindow>
      <button className="p-4" onClick={() => {}}>
        +
      </button>
      {query.data && (
        <PanelTable
          data={query.data}
          columns={columns}
          onRowClick={(row) => handleRowClick(row)}
        />
      )}
    </PanelWindow>
  );
}
