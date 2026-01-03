import type { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote
}: NoteListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="note-list">
      <div className="note-list-header">
        <h2>メモ一覧</h2>
        <button onClick={onCreateNote} className="new-note-btn">
          + 新規メモ
        </button>
      </div>
      <div className="note-list-items">
        {notes.length === 0 ? (
          <p className="empty-message">メモがありません</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="note-item-header">
                <h3>{note.title || '無題のメモ'}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="delete-btn"
                  title="削除"
                >
                  ×
                </button>
              </div>
              <p className="note-preview">{note.content.substring(0, 50)}...</p>
              <span className="note-date">{formatDate(note.updatedAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
