import type { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const TITLE_MAX = 50;
const CONTENT_MAX = 1000;

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

  const titleLength = note.title.length;
  const contentLength = note.content.length;
  const titleAtLimit = titleLength >= TITLE_MAX;
  const contentAtLimit = contentLength >= CONTENT_MAX;
  const titleEmpty = note.title.trim().length === 0;

  return (
    <div className="note-editor">
      {titleEmpty && (
        <div className="title-required-banner" role="alert">
          タイトルは必須です
        </div>
      )}
      <div className="note-editor-field">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="タイトルを入力..."
          className="note-title-input"
          maxLength={TITLE_MAX}
        />
        <div className={`char-counter ${titleAtLimit ? 'char-counter-limit' : ''}`}>
          {titleLength} / {TITLE_MAX}
        </div>
      </div>
      <div className="note-editor-field note-editor-content-field">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="メモを入力..."
          className="note-content-input"
          maxLength={CONTENT_MAX}
        />
        <div className={`char-counter ${contentAtLimit ? 'char-counter-limit' : ''}`}>
          {contentLength} / {CONTENT_MAX}
        </div>
      </div>
    </div>
  );
}
