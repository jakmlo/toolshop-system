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

import { Tool } from "@prisma/client";
import Link from "next/link";

export const columns: ColumnDef<Tool>[] = [
  {
    accessorKey: "toolId",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Nazwa",
  },
  {
    accessorKey: "catalogNumber",
    header: "Numer katalogowy",
  },
  {
    accessorKey: "availability",
    header: "Dostępność",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const equipment = row.original;

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
              onClick={() => navigator.clipboard.writeText(equipment.toolId)}
            >
              Copy equipment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/equipment/${equipment.toolId}`}>
                View equipment details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
