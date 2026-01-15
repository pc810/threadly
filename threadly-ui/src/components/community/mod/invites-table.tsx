"use client";

import {
	type ColumnDef,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AppTable, AppTablePagination } from "@/components/app-table";
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
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserItem } from "@/components/user/avatar";
import { formatDate } from "@/lib/format";
import { CommunityRoleLabel } from "@/lib/label";
import {
	useCommunityInviteRemove,
	useCommunityInvites,
} from "@/query/community";
import type {
	CommunityMembershipInviteDTO,
	CommunityRole,
} from "@/types/community";

interface CommunityInvitesTableProps {
	communityId: string;
	role?: CommunityRole;
	className?: string;
}

export function CommunityInvitesTable({
	communityId,
	role,
	className,
}: CommunityInvitesTableProps) {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 5,
	});

	const { data } = useCommunityInvites(
		communityId,
		role,
		pagination.pageIndex,
		pagination.pageSize,
	);

	const removeInviteMutation = useCommunityInviteRemove(communityId);

	const handleRemove = useCallback(
		(invite: CommunityMembershipInviteDTO) => {
			console.log("Remove invite:", invite);
			removeInviteMutation.mutate(invite);
		},
		[removeInviteMutation],
	);

	const columns = useMemo<ColumnDef<CommunityMembershipInviteDTO>[]>(
		() => [
			{
				accessorKey: "id.userId",
				header: "Username",
				cell: ({ cell }) => <UserItem userId={cell.getValue<string>()} />,
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
				cell: ({ cell }) => <UserItem userId={cell.getValue<string>()} />,
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
		[handleRemove],
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
		<div className={clsx("space-y-1", className)}>
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
					<AlertDialogAction onClick={() => onRemove(row.original)}>
						Remove
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
