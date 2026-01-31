import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X } from 'lucide-react';

const NotesApp = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('notes');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedNote, setSelectedNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editColor, setEditColor] = useState('#fbbf24');

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const createNewNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            color: '#fbbf24',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setEditMode(true);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setEditColor(newNote.color);
    };

    const deleteNote = (id) => {
        if (window.confirm('Delete this note?')) {
            setNotes(notes.filter(n => n.id !== id));
            if (selectedNote?.id === id) {
                setSelectedNote(null);
                setEditMode(false);
            }
        }
    };

    const saveNote = () => {
        if (selectedNote) {
            setNotes(notes.map(n =>
                n.id === selectedNote.id
                    ? { ...n, title: editTitle, content: editContent, color: editColor, updatedAt: new Date().toISOString() }
                    : n
            ));
            setSelectedNote({ ...selectedNote, title: editTitle, content: editContent, color: editColor });
            setEditMode(false);
        }
    };

    const startEdit = (note) => {
        setSelectedNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditColor(note.color);
        setEditMode(true);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const colors = [
        { name: 'Yellow', value: '#fbbf24' },
        { name: 'Green', value: '#10b981' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Red', value: '#ef4444' }
    ];

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notes List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[30px] p-6 border border-white/10 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Notes</h2>
                                <button
                                    onClick={createNewNote}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-xl transition-colors"
                                >
                                    <Plus className="text-white" size={20} />
                                </button>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredNotes.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8 text-sm">
                                        {searchQuery ? 'No notes found' : 'No notes yet'}
                                    </p>
                                ) : (
                                    filteredNotes.map(note => (
                                        <div
                                            key={note.id}
                                            onClick={() => {
                                                setSelectedNote(note);
                                                setEditMode(false);
                                            }}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all group relative
                        ${selectedNote?.id === note.id ? 'ring-2 ring-white' : 'hover:scale-[1.02]'}`}
                                            style={{ backgroundColor: note.color + '40', borderColor: note.color }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white truncate mb-1">{note.title}</h3>
                                                    <p className="text-sm text-gray-300 line-clamp-2">{note.content || 'Empty note'}</p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {new Date(note.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNote(note.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                                >
                                                    <Trash2 className="text-red-400" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
                                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                            </div>
                        </div>
                    </div>

                    {/* Note Editor */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 min-h-[600px]">
                            {!selectedNote ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Edit2 size={64} className="mb-4 opacity-30" />
                                    <p className="text-xl">Select a note or create a new one</p>
                                </div>
                            ) : editMode ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="flex-1 text-3xl font-bold bg-transparent border-none text-white focus:outline-none"
                                            placeholder="Note title"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveNote}
                                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setEditTitle(selectedNote.title);
                                                    setEditContent(selectedNote.content);
                                                    setEditColor(selectedNote.color);
                                                }}
                                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-400 text-sm mb-2">Color</label>
                                        <div className="flex gap-2">
                                            {colors.map(color => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setEditColor(color.value)}
                                                    className={`w-10 h-10 rounded-xl transition-all ${editColor === color.value ? 'ring-2 ring-white scale-110' : ''}`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full h-[400px] p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Start typing..."
                                    />

                                    <div className="text-sm text-gray-400">
                                        Created: {new Date(selectedNote.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-3xl font-bold text-white">{selectedNote.title}</h2>
                                        <button
                                            onClick={() => startEdit(selectedNote)}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                    </div>

                                    <div
                                        className="p-6 rounded-2xl mb-4"
                                        style={{ backgroundColor: selectedNote.color + '20' }}
                                    >
                                        <div className="text-white text-lg whitespace-pre-wrap">
                                            {selectedNote.content || <span className="text-gray-400 italic">Empty note</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                                        <div>Created: {new Date(selectedNote.createdAt).toLocaleString()}</div>
                                        <div>Updated: {new Date(selectedNote.updatedAt).toLocaleString()}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesApp;
