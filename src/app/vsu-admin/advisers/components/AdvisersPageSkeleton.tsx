import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const skeletonRows = Array.from({ length: 5 });

export function AdvisersPageSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 bg-white px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Search Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
          <Table className={undefined}>
            <TableHeader className={undefined}>
              <TableRow className="border-b border-neutral-100 bg-neutral-50/50">
                <TableHead className={undefined}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className={undefined}>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Skeleton className="h-4 w-40" />
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={undefined}>
              {skeletonRows.map((_, index) => (
                <TableRow key={index} className="border-b border-neutral-100">
                  <TableCell className={undefined}>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className={undefined}>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
