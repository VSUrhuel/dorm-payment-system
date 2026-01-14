import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
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
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="relative overflow-hidden border border-neutral-200/60 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bento Section Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Skeleton */}
          <Card className="lg:col-span-2 border-neutral-200 bg-white">
            <CardHeader className="border-b border-neutral-100 py-4 px-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-[280px] flex items-end justify-between gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <Skeleton className="h-3 w-8" />
                    {/* <Skeleton 
                      className="w-full rounded-md" 
                      style={{ height: `${Math.random() * 150 + 50}px` }} 
                    /> */}
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Repair Requests Skeleton */}
          <Card className="border-neutral-200 bg-white">
            <CardHeader className="border-b border-neutral-100 py-4 px-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-5 py-4 border-b border-neutral-100 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
