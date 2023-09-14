"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Rental = {
  RentalID: string;
  ToolID: string;
  CustomerID: string;
  RentalDate: Date;
  ReturnDate: Date;
  Status: "pending" | "returned";
};

export const columns: ColumnDef<Rental>[] = [
  {
    accessorKey: "ToolID",
    header: "Tool ID",
  },
  {
    accessorKey: "CustomerID",
    header: "Contractor",
  },
  {
    accessorKey: "RentalDate",
    header: "Rental Date",
  },
  {
    accessorKey: "ReturnDate",
    header: "Return Date",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rental = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(rental.id)}
            >
              Copy rental ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View rental details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
