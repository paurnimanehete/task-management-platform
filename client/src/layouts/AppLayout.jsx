import React, { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { useSelector } from 'react-redux';
import { fetchUsers } from '../features/users/userSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

export const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { addTask, actionLoading } = useTasks();
  const { users } = useSelector((state) => state.users);

  const openCreateModal = useCallback(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
    setCreateModalOpen(true);
  }, [dispatch, users.length]);

  const handleCreateTask = async (formData) => {
    const result = await addTask(formData);
    if (!result.error) {
      toast.success('Task created successfully!');
      setCreateModalOpen(false);
    } else {
      toast.error(result.payload || 'Failed to create task.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenCreateModal={openCreateModal}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCreateModal={openCreateModal}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Create Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
        subtitle="Fill in the details to add a new task to the team."
        maxWidth="max-w-2xl"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setCreateModalOpen(false)}
          loading={actionLoading}
        />
      </Modal>
    </div>
  );
};

export default AppLayout;
