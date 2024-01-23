"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  addUserToOrganization,
  removeUserFromOrganization,
} from "@/lib/actions/workspaces/actions";
import { toast } from "@/components/ui/use-toast";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nazwa użytkownika",
  },
  {
    accessorKey: "email",
    header: "Adres użytkownika",
  },
  {
    accessorKey: "role",
    header: "Rola",
  },
  {
    accessorKey: "accepted",
    header: "Status",
  },
  {
    id: "actions",
    header: "Akcje",
    cell: ({ row }) => {
      const user = row.original;

      if (user.accepted) return null;

      return (
        <div className="flex flex-row gap-4">
          <Button
            onClick={async () => {
              try {
                const res = await addUserToOrganization(user.id);
                if (res?.status === 200) {
                  toast({
                    title: "Dodano użytkownika do organizacji",
                    description: "Użytkownik otrzymał domyślną rolę",
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Błąd",
                    description: res?.message,
                    variant: "destructive",
                  });
                }
              } catch (error: any) {
                toast({
                  title: "Błąd",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
            variant="ghost"
          >
            <Check className=" text-green-400" />
          </Button>
          <Button
            onClick={async () => {
              try {
                const res = await removeUserFromOrganization(user.id);
                if (res?.status === 200) {
                  toast({
                    title: "Usunięto użytkownika z organizacji",
                    description: "",
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Błąd",
                    description: res?.message,
                    variant: "destructive",
                  });
                }
              } catch (error: any) {
                toast({
                  title: "Błąd",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
            variant="ghost"
          >
            <X className="text-red-400" />
          </Button>
        </div>
      );
    },
  },
];
