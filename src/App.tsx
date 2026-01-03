import { useState } from 'react';
import type { Note } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import './styles/App.css';

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find(note => note.id === selectedNoteId) || null;

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="app">
      <NoteList
        notes={sortedNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
      />
      <NoteEditor
        note={selectedNote}
        onUpdateNote={updateNote}
      />
    </div>
  );
}

export default App;
