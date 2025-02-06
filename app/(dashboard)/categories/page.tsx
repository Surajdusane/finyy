"use client";

import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/Table/data-table";
import { Skeleton } from "@/components/ui/skeleton";


const CategoriesPage = () => {
  const { onOpen } = useNewCategory();
  const deleteCategory = useBulkDeleteCategories();
  const categoryQuery = useGetCategories();
  const accounts = categoryQuery.data || [];

  const isDisabled = categoryQuery.isLoading || deleteCategory.isPending;

  if(categoryQuery.isLoading){
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48"/>
                </CardHeader>
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  } 

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-5" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
            <DataTable onDelete={(row) => {
                const ids = row.map((row) => row.original.id)
                deleteCategory.mutate({ids})
            }} columns={columns} data={accounts} fileterKey="name" disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
