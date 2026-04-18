interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ open, onCancel, onConfirm }: DeleteConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-confirm-title" className="modal-title">メモを削除</h3>
        <p className="modal-body">このメモを削除しますか？</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn-cancel" onClick={onCancel}>
            キャンセル
          </button>
          <button type="button" className="modal-btn modal-btn-danger" onClick={onConfirm}>
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
