import { startTransition, Suspense, use, useState, useTransition } from "react";
import { createUser, deleteUser, fetchUsers } from "../../shared/api";

type User = {
  id: string;
  email: string;
  name?: string;
};

const defaultUsersPromise = fetchUsers();

export function UsersPage() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));
  return (
    <main className="container mx-auto p-5 pt-10">
      <h1 className="text-3x1 font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <Suspense fallback={<div>Loading...</div>}>
        <UsersList usersPromise={usersPromise} refetchUsers={refetchUsers} />
      </Suspense>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [email, setEmail] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createUser({
        email,
        id: crypto.randomUUID(),
      });
      refetchUsers();
      setEmail("");
    });
  };
  return (
    <form className="flex flex-col max-w-2xs gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        placeholder="email"
        disabled={isPending}
      />

      <button
        className="w-[100px] bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded disabled:bg-gray-400"
        disabled={isPending}
        type="submit"
      >
        Add
      </button>
    </form>
  );
}

export function UsersList({
  usersPromise,
  refetchUsers,
}: {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(usersPromise);
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  user: User;
  refetchUsers: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteUser(user.id);
      refetchUsers();
    });
  };
  return (
    <div
      className="flex gap-2 border bg-amber-200 p-2 mt-5 rounded "
      key={user.id}
    >
      <div>{user.email}</div>
      <button
        type="button"
        className="w-[100px] bg-red-400 hover:bg-red-500 text-white font-bold p-2 ml-auto rounded disabled:bg-gray-400"
        disabled={isPending}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
