import { useEffect, useMemo, useState } from 'react';
import type { Note, SortKey } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import './styles/App.css';

const PIN_LIMIT = 5;
const PIN_LIMIT_ERROR_DURATION_MS = 3000;

function App() {
  const [rawNotes, setRawNotes] = useLocalStorage<Note[]>('notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt_desc');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [pinLimitError, setPinLimitError] = useState(false);

  // 既存データ互換: pinned が欠けている場合は false として扱う
  const notes = useMemo<Note[]>(
    () => rawNotes.map((note) => ({ ...note, pinned: note.pinned ?? false })),
    [rawNotes]
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  const createNote = () => {
    const now = Date.now();
    const newNote: Note = {
      id: now.toString(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };
    setRawNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setRawNotes(notes.map((note) => (note.id === id ? { ...note, ...updates } : note)));
  };

  const requestDeleteNote = (id: string) => {
    setDeleteTargetId(id);
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const confirmDelete = () => {
    if (deleteTargetId == null) return;
    const id = deleteTargetId;
    setRawNotes(notes.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    setDeleteTargetId(null);
  };

  const togglePin = (id: string) => {
    const target = notes.find((note) => note.id === id);
    if (!target) return;

    if (!target.pinned) {
      const currentPinnedCount = notes.filter((note) => note.pinned).length;
      if (currentPinnedCount >= PIN_LIMIT) {
        // 上限超え: ピン ON 操作は無視し、エラー表示
        setPinLimitError(true);
        return;
      }
    }

    setRawNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)));
  };

  // ピン上限エラーは 3 秒で自動消去
  useEffect(() => {
    if (!pinLimitError) return;
    const timer = window.setTimeout(() => {
      setPinLimitError(false);
    }, PIN_LIMIT_ERROR_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [pinLimitError]);

  return (
    <div className="app">
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        sortKey={sortKey}
        pinLimitError={pinLimitError}
        onSelectNote={setSelectedNoteId}
        onCreateNote={createNote}
        onRequestDeleteNote={requestDeleteNote}
        onTogglePin={togglePin}
        onSearchQueryChange={setSearchQuery}
        onSortKeyChange={setSortKey}
      />
      <NoteEditor note={selectedNote} onUpdateNote={updateNote} />
      <DeleteConfirmModal
        open={deleteTargetId !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default App;
