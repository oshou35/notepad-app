import type { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  if (!note) {
    return (
      <div className="note-editor empty">
        <p>メモを選択するか、新しいメモを作成してください</p>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote(note.id, { title: e.target.value, updatedAt: Date.now() });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote(note.id, { content: e.target.value, updatedAt: Date.now() });
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        value={note.title}
        onChange={handleTitleChange}
        placeholder="タイトルを入力..."
        className="note-title-input"
      />
      <textarea
        value={note.content}
        onChange={handleContentChange}
        placeholder="メモを入力..."
        className="note-content-input"
      />
    </div>
  );
}
