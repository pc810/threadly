"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppUser } from "@/components/app-user";
import {
  useCommunityInviteRemove,
  useCommunityInvites,
} from "@/query/community.query";
import { AppTable, AppTablePagination } from "../app-table";
import { formatDate } from "@/lib/format";
import {
  CommunityMembershipInviteDTO,
  CommunityRole,
  CommunityRoleLabel,
} from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  communityId: string;
  role?: CommunityRole;
}

export function CommunityInvitesTable({ communityId, role }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data } = useCommunityInvites(
    communityId,
    role,
    pagination.pageIndex,
    pagination.pageSize
  );

  const removeInviteMutation = useCommunityInviteRemove(communityId);

  const handleRemove = (invite: CommunityMembershipInviteDTO) => {
    console.log("Remove invite:", invite);
    removeInviteMutation.mutate(invite);
  };

  const columns = useMemo<ColumnDef<CommunityMembershipInviteDTO>[]>(
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
        accessorKey: "invitedBy",
        header: "Invited By",
        cell: ({ cell }) => <AppUser userId={cell.getValue<string>()} />,
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: "Invited At",
        cell: ({ cell }) => {
          const createdAt = cell.getValue<string>();
          return (
            <time
              dateTime={new Date(createdAt).toISOString()}
              className="text-muted-foreground"
            >
              {formatDate(createdAt, { showTime: true })}
            </time>
          );
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TableAction row={row} onRemove={handleRemove} />,
        enableSorting: false,
      },
    ],
    [handleRemove]
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

type TableActionProps<TData> = {
  onRemove: (row: TData) => void;
  row: Row<TData>;
};

const TableAction = <TData,>({ row, onRemove }: TableActionProps<TData>) => {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash className="size-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Remove Invite</TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            invite.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onRemove(row.original)}
            variant="destructive"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
