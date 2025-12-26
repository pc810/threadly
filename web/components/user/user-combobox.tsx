import { useUsers, UseUsersOpts } from "@/query/user.query";
import { UserDTO } from "@/types";
import {
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxLoading,
  ComboboxEmpty,
  ComboboxItem,
} from "@/components/ui/combobox";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AppUserItem } from "@/components/app-user";
import { Combobox } from "@/components/ui/combobox";

interface UserSearchComboboxProps {
  value: string;
  onChange: (user: string | null) => void;
  options: Partial<UseUsersOpts>;
}

export const UserSearchCombobox = ({
  value,
  onChange,
  options,
}: UserSearchComboboxProps) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const { data: users, isLoading } = useUsers(search, options);

  const clearSelection = () => {
    setSearch("");
    setSelectedUser(null);
    onChange(null);
  };

  return (
    <Combobox
      value={value}
      onValueChange={(v) => {
        const user = users?.content.find((u) => u.id === v) ?? null;
        setSelectedUser(user);
        setSearch("");
        onChange(user?.id ?? null);
      }}
      inputValue={search}
      onInputValueChange={setSearch}
      manualFiltering
    >
      <ComboboxAnchor className="h-12">
        {selectedUser ? (
          <div className="flex items-center justify-between gap-2 py-2 w-full">
            <AppUserItem userId={selectedUser.id} />

            <button
              type="button"
              onClick={clearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <ComboboxInput placeholder="Search user" value={search} />
            <ComboboxTrigger>
              <ChevronDown className="h-4 w-4" />
            </ComboboxTrigger>
          </>
        )}
      </ComboboxAnchor>

      <ComboboxContent>
        {isLoading && <ComboboxLoading label="Searching users..." />}

        {!isLoading && search.length >= 2 && users?.content.length === 0 && (
          <ComboboxEmpty>No users found.</ComboboxEmpty>
        )}

        {search.length < 2 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Type at least 2 characters
          </div>
        )}

        {!isLoading &&
          search.length >= 2 &&
          users?.content.map((user) => (
            <ComboboxItem key={user.id} value={user.id} className="px-0">
              <AppUserItem userId={user.id} />
            </ComboboxItem>
          ))}
      </ComboboxContent>
    </Combobox>
  );
};
