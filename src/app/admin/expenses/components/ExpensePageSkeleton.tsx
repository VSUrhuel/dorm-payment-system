import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExpensesPageSkeleton() {
  const skeletonRows = Array(6).fill(0);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>
      <div className="p-4 border rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-2/3" />
          <Skeleton className="h-10 w-full md:w-1/3" />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table className={undefined}>
          <TableHeader className={undefined}>
            <TableRow className={undefined}>
              <TableHead className={undefined}>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead className={undefined}>
                <Skeleton className="h-5 w-40" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Skeleton className="h-5 w-28" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={undefined}>
            {skeletonRows.map((_, index) => (
              <TableRow key={index} className={undefined}>
                <TableCell className={undefined}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className={undefined}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
