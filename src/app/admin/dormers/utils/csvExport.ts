import { toast } from "sonner";
import { Dormer } from "../types";

export const handleExport = (dormers: Dormer[]) => {
  if (dormers.length === 0) {
    toast.info("No data to export.");
    return;
  }

  const convertToCSV = (data: Dormer[]): string => {
    const headers = [
      "Dormer ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Role",
      "Room Number",
    ];

    const rows = data.map((dormer) => {
      const { id, firstName, lastName, email, phone, role, roomNumber } =
        dormer;
      const dormerName = `"${dormer.firstName} ${dormer.lastName}"`;

      return [
        id,
        `"${firstName}"`,
        `"${lastName}"`,
        `"${email}"`,
        `"${phone}"`,
        `"${role}"`,
        `"${roomNumber}"`,
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  };

  const csvData = convertToCSV(dormers);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `dormer-list-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("Dormer data exported successfully!");
};
