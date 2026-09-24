import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors';

export const TaskForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { users } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'),
    assignedUser: '',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        dueDate: initialData.dueDate
          ? format(new Date(initialData.dueDate), 'yyyy-MM-dd')
          : format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'),
        assignedUser: initialData.assignedUser?._id || initialData.assignedUser || '',
      });
    } else {
      // Default assigned user to self
      if (currentUser) {
        setForm((prev) => ({ ...prev, assignedUser: currentUser._id }));
      }
    }
  }, [initialData, currentUser]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim() || form.title.trim().length < 3)
      newErrors.title = 'Title must be at least 3 characters.';
    if (!form.description.trim())
      newErrors.description = 'Description is required.';
    if (!form.dueDate)
      newErrors.dueDate = 'Due date is required.';
    if (!form.assignedUser)
      newErrors.assignedUser = 'Please assign the task to a team member.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Task Title" required error={errors.title}>
        <input
          id="task-title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Implement login page"
          className={inputCls}
          autoFocus
        />
      </FormField>

      <FormField label="Description" required error={errors.description}>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task in detail..."
          className={`${inputCls} resize-none`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Priority" error={errors.priority}>
          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputCls}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Status" error={errors.status}>
          <select
            id="task-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Due Date" required error={errors.dueDate}>
        <input
          id="task-dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          className={inputCls}
        />
      </FormField>

      <FormField label="Assign To" required error={errors.assignedUser}>
        <select
          id="task-assignedUser"
          name="assignedUser"
          value={form.assignedUser}
          onChange={handleChange}
          className={inputCls}
        >
          <option value="">Select a team member...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email}){u._id === currentUser?._id ? ' — Me' : ''}
            </option>
          ))}
        </select>
      </FormField>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg shadow-sm shadow-blue-500/25 transition-colors"
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
