import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser, toggleUserBlocked } from "../../api/api";
import { useState } from "react";
import Button from "../../components/button";
import PanelHeaderBar from "../../components/page-header-bar";
import Modal from "../../components/modal";
import type { UserRole } from "../../app/types/user";
import StatusPill from "../../components/status-pill";

const formatRole = (role: string) => {
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  return role.charAt(0) + role.slice(1).toLowerCase();
};

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
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

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    }
  });

  const toggleBlockedMutation = useMutation({
    mutationFn: () => {
      if (!user?.userAccount?.id) {
        throw new Error('User account ID not found');
      }
      return toggleUserBlocked(user.userAccount.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    }
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER"
  });

  const canModifyUser = user?.userAccount?.role !== 'SUPER_ADMIN';
  const roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' }
  ];

  // Initialize form data when user data is loaded
  const startEditing = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.userAccount?.email || "",
        role: user.userAccount?.role || "USER"
      });
    }
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      updateUserMutation.mutate({
        userId,
        ...formData,
        role: formData.role as UserRole
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (userId) {
      deleteUserMutation.mutate(userId);
    }
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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sims-green-600 focus:border-sims-green-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sims-green-600 focus:border-sims-green-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sims-green-600 focus:border-sims-green-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sims-green-600 focus:border-sims-green-600"
                  disabled={!canModifyUser}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {user.userAccount?.role === 'SUPER_ADMIN' && (
                    <option value="SUPER_ADMIN">Super Admin</option>
                  )}
                </select>
                {!canModifyUser && (
                  <p className="mt-1 text-sm text-gray-500">
                    Super Admin role cannot be modified
                  </p>
                )}
              </div>
            </div>
            <hr/>

            <div className="flex flex-row flex-grow justify-center gap-2">              <Button
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
              <div className="mt-2 text-red-700">
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
      <PanelHeaderBar title={`User: ${user.firstName} ${user.lastName}`} />
      
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
              <div className="mt-1 text-lg">
                {formatRole(user.userAccount?.role || '')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1 text-lg flex items-center gap-2">
                <StatusPill variant={user.userAccount?.isBlocked ? "danger" : "success"}>
                  {user.userAccount?.isBlocked ? "Blocked" : "Active"}
                </StatusPill>
              </div>
            </div>
          </div>
          <hr/>

          <div className="flex justify-between space-x-3 mt-6">
            {canModifyUser && (
              <div className="flex flex-row flex-grow justify-center gap-2">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                </Button>
                  <Button
                    variant={user.userAccount?.isBlocked ? "outline-success" : "outline-danger"}
                    onClick={() => toggleBlockedMutation.mutate()}
                    disabled={toggleBlockedMutation.isPending}
                  >
                    {toggleBlockedMutation.isPending 
                      ? "Updating..." 
                      : user.userAccount?.isBlocked 
                        ? "Unblock User" 
                        : "Block User"
                    }
                  </Button>
                  <Button
                    variant="primary"
                    onClick={startEditing}
                  >
                    Edit User
                  </Button>
              </div>
            )}
          </div>

          {deleteUserMutation.isError && (
            <div className="mt-2 text-red-700">
              {deleteUserMutation.error.message || "Failed to delete user"}
            </div>
          )}
          
          {toggleBlockedMutation.isError && (
            <div className="mt-2 text-red-700">
              {toggleBlockedMutation.error.message || "Failed to update user status"}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        title="Delete User?"
        actionButtons={[
          {
            variant: "danger" as const,
            onClick: handleDelete,
            disabled: deleteUserMutation.isPending || !canModifyUser,
            children: deleteUserMutation.isPending ? "Deleting..." : "Delete"
          }
        ]}
      >
        <div className="text-left space-y-4">
          <p className="text-red-700 font-semibold">Warning: This action is permanent and cannot be undone.</p>
          <p>Deleting this user will remove them from all projects in the system.</p>
          <p className="mt-4">
            <span className="font-medium">Recommendation: </span>
            Consider blocking the user instead. This will prevent them from accessing the system while preserving all of their data.
          </p>
        </div>
      </Modal>
    </div>
  );
} 