"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Note {
  id: number;
  content: string;
  tags: string[];
}

export default function MarkdownTodos() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), content: newNote, tags: [] }]);
      setNewNote("");
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id: number, content: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, content } : note)));
    setEditingId(null);
  };

  const filteredNotes = notes.filter((note) => note.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        document.getElementById("new-note-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold mb-4">Markdown Notes</h1>
      <button
        onClick={toggleDarkMode}
        className="mb-4 px-2 py-1 bg-blue-500 text-white rounded"
      >
        Toggle Dark Mode
      </button>
      <div className="mb-4">
        <input
          id="new-note-input"
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="New note..."
          className="w-full p-2 border rounded text-black"
        />
        <button
          onClick={addNote}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Note
        </button>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search notes..."
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <ul>
        {filteredNotes.map((note) => (
          <li
            key={note.id}
            className="mb-4 p-2 border rounded"
          >
            {editingId === note.id ? (
              <input
                type="text"
                value={note.content}
                onChange={(e) => editNote(note.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                className="w-full p-2 border rounded text-black"
                autoFocus
              />
            ) : (
              <div onClick={() => setEditingId(note.id)}>
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
            )}
            <button
              onClick={() => deleteNote(note.id)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
