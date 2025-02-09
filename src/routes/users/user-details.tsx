import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../api/api";
import { useState } from "react";
import Button from "../../components/button";
import PanelHeaderBar from "../../components/page-header-bar";

export default function UserDetails() {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setIsEditing(false);
    }
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false
  });

  // Initialize form data when user data is loaded
  const startEditing = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.userAccount?.email || "",
        isAdmin: user.userAccount?.isAdmin || false
      });
    }
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      updateUserMutation.mutate({
        userId,
        ...formData
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-4">Loading user details...</div>;
  }

  if (!user) {
    return <div className="text-center py-4 text-gray-500">User not found</div>;
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <PanelHeaderBar title={`Edit User: ${user.firstName} ${user.lastName}`} />
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Role</label>
                <select
                  value={formData.isAdmin ? "admin" : "user"}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value === "admin" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="white"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {updateUserMutation.isError && (
              <div className="mt-2 text-red-600">
                {updateUserMutation.error.message || "Failed to update user"}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PanelHeaderBar title={`${user.firstName} ${user.lastName}`} />
      
      <div className="p-4">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <div className="mt-1 text-lg">{user.firstName}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <div className="mt-1 text-lg">{user.lastName}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <div className="mt-1 text-lg">{user.userAccount?.email}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Role</label>
              <div className="mt-1 text-lg">{user.userAccount?.isAdmin ? "Admin" : "User"}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="primary"
              onClick={startEditing}
            >
              Edit User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 