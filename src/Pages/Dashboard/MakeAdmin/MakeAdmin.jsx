import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["userSearch", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchTerm}`);
      return res.data;
    },
    enabled: !!searchTerm,
  });

  const { mutate: changeUserRole, } = useMutation({
    mutationFn: async ({ userId, role }) => {
      const res = await axiosSecure.patch(`/users/role/${userId}`, { role });
      return res.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire("✅ Success", `Role changed to ${variables.role}`, "success");
      refetch(); // from useQuery
    },
    onError: () => {
      Swal.fire("❌ Failed", "Something went wrong", "error");
    },
  });

  const handleRoleChange = (userId, newRole) => {
    Swal.fire({
      title: `Change role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeUserRole({ userId, role: newRole }); // ✅ simple, clean
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔐 Manage Admins</h2>

      {/* 🔍 Search Box */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter partial email"
          className="input input-bordered w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary text-black">Search</button>
      </form>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-red-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id}>
                  <td>{idx + 1}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "badge-success" : "badge-info"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>

                  <td>
                    {u.role !== "admin" ? (
                      <button
                        onClick={() => handleRoleChange(u._id, "admin")}
                        className="btn btn-success btn-sm"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(u._id, "user")}
                        className="btn btn-warning btn-sm"
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
