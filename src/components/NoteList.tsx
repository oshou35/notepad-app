import type { Note, SortKey } from '../types';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  sortKey: SortKey;
  pinLimitError: boolean;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onRequestDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSortKeyChange: (key: SortKey) => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  searchQuery,
  sortKey,
  pinLimitError,
  onSelectNote,
  onCreateNote,
  onRequestDeleteNote,
  onTogglePin,
  onSearchQueryChange,
  onSortKeyChange,
}: NoteListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotes = normalizedQuery
    ? notes.filter((note) => note.title.toLowerCase().includes(normalizedQuery))
    : notes;

  const pinnedNotes = filteredNotes
    .filter((note) => note.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const unpinnedNotes = [...filteredNotes.filter((note) => !note.pinned)].sort((a, b) => {
    switch (sortKey) {
      case 'updatedAt_desc':
        return b.updatedAt - a.updatedAt;
      case 'updatedAt_asc':
        return a.updatedAt - b.updatedAt;
      case 'createdAt_desc':
        return b.createdAt - a.createdAt;
      case 'createdAt_asc':
        return a.createdAt - b.createdAt;
      case 'title_asc':
        return a.title.localeCompare(b.title, 'ja');
      case 'title_desc':
        return b.title.localeCompare(a.title, 'ja');
      default:
        return b.updatedAt - a.updatedAt;
    }
  });

  const renderNoteItem = (note: Note) => {
    const titleEmpty = note.title.trim().length === 0;
    return (
      <div
        key={note.id}
        className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
        onClick={() => onSelectNote(note.id)}
      >
        <div className="note-item-header">
          <h3 className={titleEmpty ? 'note-title-untitled' : ''}>
            {titleEmpty ? '(無題)' : note.title}
          </h3>
          <div className="note-item-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
              title={note.pinned ? 'ピン留めを解除' : 'ピン留め'}
              aria-label={note.pinned ? 'ピン留めを解除' : 'ピン留め'}
              aria-pressed={note.pinned}
            >
              📌
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestDeleteNote(note.id);
              }}
              className="delete-btn"
              title="削除"
              aria-label="削除"
            >
              ×
            </button>
          </div>
        </div>
        <p className="note-preview">{note.content.substring(0, 50)}</p>
        <span className="note-date">{formatDate(note.updatedAt)}</span>
      </div>
    );
  };

  const hasAnyResult = pinnedNotes.length + unpinnedNotes.length > 0;

  return (
    <div className="note-list">
      <div className="note-list-header">
        <h2>メモ一覧</h2>
        <button onClick={onCreateNote} className="new-note-btn">
          + 新規メモ
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="メモを検索"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          aria-label="並び順"
        >
          <option value="updatedAt_desc">更新日時（新しい順）</option>
          <option value="updatedAt_asc">更新日時（古い順）</option>
          <option value="createdAt_desc">作成日時（新しい順）</option>
          <option value="createdAt_asc">作成日時（古い順）</option>
          <option value="title_asc">タイトル（昇順）</option>
          <option value="title_desc">タイトル（降順）</option>
        </select>
      </div>
      {pinLimitError && (
        <div className="pin-limit-error" role="alert">
          ピン留めは最大 5 件までです
        </div>
      )}
      <div className="note-list-items">
        {!hasAnyResult ? (
          <p className="empty-message">
            {normalizedQuery ? '該当するメモはありません' : 'メモがありません'}
          </p>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div className="note-list-section note-list-section-pinned">
                <div className="note-list-section-header">ピン留め</div>
                {pinnedNotes.map(renderNoteItem)}
              </div>
            )}
            {unpinnedNotes.length > 0 && (
              <div className="note-list-section">
                {unpinnedNotes.map(renderNoteItem)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
