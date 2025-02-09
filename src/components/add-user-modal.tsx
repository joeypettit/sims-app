import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from './modal';
import { createUser } from '../api/api';

type AddUserModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AddUserModal({ isOpen, setIsOpen }: AddUserModalProps) {
  const queryClient = useQueryClient();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: false
  });

  useEffect(() => {
    if (isOpen && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isOpen]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdmin: false
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit', formData);
    createUserMutation.mutate(formData);
  };

  const actionButtons = [
    {
      variant: "secondary" as const,
      onClick: () => {
        
        setIsOpen(false)},
      children: "Cancel"
    },
    {
      variant: "primary" as const,
      type: "submit" as const,
      form: "createUserForm",
      disabled: createUserMutation.isPending,
      children: createUserMutation.isPending ? "Creating..." : "Create User"
    },
  ];

  return (
    <Modal 
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create New User"
      actionButtons={actionButtons}
    >
      <form id="createUserForm" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              ref={firstNameRef}
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
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        {createUserMutation.isError && (
          <div className="mt-2 text-red-600">
            {createUserMutation.error.message || "Failed to create user"}
          </div>
        )}
      </form>
    </Modal>
  );
} 
