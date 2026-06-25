import { prisma } from "@top-tier-id/database";
import { UserActions } from "./user-actions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return (
    <>
      <h1 className="page-title">Users</h1>
      <p className="text-muted mb-6">{users.length} total users</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Admin?</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border">
                <td className="py-3 pr-4 font-medium">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-3 pr-4 text-muted">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className="rounded bg-surface px-2 py-0.5 text-xs">{u.role}</span>
                </td>
                <td className="py-3 pr-4">
                  {u.isAdmin ? (
                    <span className="text-brand text-xs font-medium">Yes</span>
                  ) : (
                    <span className="text-muted text-xs">No</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted text-xs">
                  {u.createdAt.toLocaleDateString()}
                </td>
                <td className="py-3">
                  <UserActions userId={u.id} isAdmin={u.isAdmin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
