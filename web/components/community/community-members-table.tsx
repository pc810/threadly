"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppUser } from "@/components/app-user";
import { useCommunityMembers } from "@/query/community.query";
import { AppTable, AppTablePagination } from "../app-table";
import { formatDate } from "@/lib/format";
import {
  CommunityMembershipDTO,
  CommunityRole,
  CommunityRoleLabel,
} from "@/types";

interface Props {
  communityId: string;
  role: CommunityRole;
}

export function CommunityMembersTable({ communityId, role }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data } = useCommunityMembers(
    communityId,
    role,
    pagination.pageIndex,
    pagination.pageSize
  );

  const columns = useMemo<ColumnDef<CommunityMembershipDTO>[]>(
    () => [
      {
        accessorKey: "id.userId",
        header: "Username",
        cell: ({ cell }) => <AppUser userId={cell.getValue<string>()} />,
        enableSorting: false,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ cell }) => CommunityRoleLabel[cell.getValue<CommunityRole>()],
        enableSorting: false,
      },
      {
        accessorKey: "joinedAt",
        header: "JOINED",
        cell: ({ cell }) => {
          const joinedAt = cell.getValue<string>();
          return (
            <time
              dateTime={new Date(joinedAt).toISOString()} // <-- use ISO string
              className="text-muted-foreground"
            >
              {formatDate(joinedAt, { showTime: true })}
            </time>
          );
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-1">
      <AppTable table={table} />
      <AppTablePagination table={table} totalPages={data?.totalPages} />
    </div>
  );
}
