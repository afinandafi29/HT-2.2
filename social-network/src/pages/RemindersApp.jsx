import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Circle, Trash2, Calendar } from 'lucide-react';

const RemindersApp = () => {
    const [lists, setLists] = useState(() => {
        const saved = localStorage.getItem('reminderLists');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Personal', color: '#3b82f6', tasks: [] },
            { id: 2, name: 'Work', color: '#ef4444', tasks: [] },
            { id: 3, name: 'Shopping', color: '#10b981', tasks: [] }
        ];
    });

    const [selectedList, setSelectedList] = useState(lists[0]);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showNewListModal, setShowNewListModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', notes: '', dueDate: '', priority: 'none' });
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState('#3b82f6');

    useEffect(() => {
        localStorage.setItem('reminderLists', JSON.stringify(lists));
    }, [lists]);

    useEffect(() => {
        const current = lists.find(l => l.id === selectedList?.id);
        if (current) setSelectedList(current);
    }, [lists, selectedList?.id]);

    const addTask = () => {
        const task = {
            id: Date.now(),
            ...newTask,
            completed: false,
            createdAt: new Date().toISOString()
        };

        setLists(lists.map(list =>
            list.id === selectedList.id
                ? { ...list, tasks: [...list.tasks, task] }
                : list
        ));

        setNewTask({ title: '', notes: '', dueDate: '', priority: 'none' });
        setShowNewTaskModal(false);
    };

    const toggleTask = (taskId) => {
        setLists(lists.map(list =>
            list.id === selectedList.id
                ? {
                    ...list,
                    tasks: list.tasks.map(task =>
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                    )
                }
                : list
        ));
    };

    const deleteTask = (taskId) => {
        setLists(lists.map(list =>
            list.id === selectedList.id
                ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
                : list
        ));
    };

    const addList = () => {
        const newList = {
            id: Date.now(),
            name: newListName,
            color: newListColor,
            tasks: []
        };
        setLists([...lists, newList]);
        setNewListName('');
        setNewListColor('#3b82f6');
        setShowNewListModal(false);
    };

    const deleteList = (listId) => {
        if (lists.length === 1) {
            alert('Cannot delete the last list');
            return;
        }
        setLists(lists.filter(l => l.id !== listId));
        if (selectedList.id === listId) {
            setSelectedList(lists.find(l => l.id !== listId));
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    const activeTasks = selectedList?.tasks.filter(t => !t.completed) || [];
    const completedTasks = selectedList?.tasks.filter(t => t.completed) || [];

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Lists Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[30px] p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">My Lists</h2>
                                <button
                                    onClick={() => setShowNewListModal(true)}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                >
                                    <Plus className="text-white" size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {lists.map(list => (
                                    <div
                                        key={list.id}
                                        onClick={() => setSelectedList(list)}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all group relative
                      ${selectedList?.id === list.id ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: list.color }}
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{list.name}</div>
                                                <div className="text-xs text-gray-400">{list.tasks.length} tasks</div>
                                            </div>
                                            {lists.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteList(list.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                                >
                                                    <Trash2 className="text-red-400" size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: selectedList?.color }}
                                    />
                                    <h2 className="text-3xl font-bold text-white">{selectedList?.name}</h2>
                                    <span className="text-gray-400">
                                        ({activeTasks.length} active, {completedTasks.length} completed)
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowNewTaskModal(true)}
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors flex items-center gap-2 font-bold text-white"
                                >
                                    <Plus size={20} />
                                    New Task
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Active Tasks */}
                                {activeTasks.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Active</h3>
                                        <div className="space-y-2">
                                            {activeTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            onClick={() => toggleTask(task.id)}
                                                            className="mt-1 p-1 hover:bg-white/10 rounded-full transition-colors"
                                                        >
                                                            <Circle className="text-gray-400" size={20} />
                                                        </button>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white mb-1">{task.title}</div>
                                                            {task.notes && (
                                                                <div className="text-sm text-gray-400 mb-2">{task.notes}</div>
                                                            )}
                                                            <div className="flex items-center gap-4 text-xs">
                                                                {task.dueDate && (
                                                                    <div className="flex items-center gap-1 text-gray-400">
                                                                        <Calendar size={12} />
                                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                                {task.priority !== 'none' && (
                                                                    <div className={`font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                                        {task.priority}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="text-red-400" size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Completed Tasks */}
                                {completedTasks.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Completed</h3>
                                        <div className="space-y-2">
                                            {completedTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className="p-4 bg-white/5 rounded-2xl border border-white/10 opacity-60 hover:opacity-100 transition-all group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            onClick={() => toggleTask(task.id)}
                                                            className="mt-1 p-1 hover:bg-white/10 rounded-full transition-colors"
                                                        >
                                                            <Check className="text-green-400" size={20} />
                                                        </button>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white line-through">{task.title}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="text-red-400" size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTasks.length === 0 && completedTasks.length === 0 && (
                                    <div className="text-center py-12 text-gray-400">
                                        <Circle size={48} className="mx-auto mb-4 opacity-30" />
                                        <p>No tasks yet. Create one to get started!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Task Modal */}
            {showNewTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewTaskModal(false)} />
                    <div className="relative bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">New Task</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Task title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <textarea
                                placeholder="Notes (optional)"
                                value={newTask.notes}
                                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={3}
                            />
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="none" className="bg-gray-900">No Priority</option>
                                <option value="low" className="bg-gray-900">Low Priority</option>
                                <option value="medium" className="bg-gray-900">Medium Priority</option>
                                <option value="high" className="bg-gray-900">High Priority</option>
                            </select>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addTask}
                                    disabled={!newTask.title}
                                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
                                >
                                    Add Task
                                </button>
                                <button
                                    onClick={() => setShowNewTaskModal(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New List Modal */}
            {showNewListModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewListModal(false)} />
                    <div className="relative bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">New List</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="List name"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Color</label>
                                <div className="flex gap-2">
                                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewListColor(color)}
                                            className={`w-10 h-10 rounded-xl transition-all ${newListColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addList}
                                    disabled={!newListName}
                                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
                                >
                                    Create List
                                </button>
                                <button
                                    onClick={() => setShowNewListModal(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemindersApp;
