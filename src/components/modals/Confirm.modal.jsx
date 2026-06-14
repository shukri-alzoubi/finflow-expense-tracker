const ConfirmModal = ({ title, message, confirmText, confirmColor, onConfirm, cancelText, onCancel, onClose, buttonClass }) => {

    const handleConfirm = () => {
        onConfirm && onConfirm();
        onCancel && onCancel();
    }

    return (<>
        {title && <div className="modal-header py-2 border-0">
            <div className="d-flex align-items-center">
                <h5 className="modal-title fw-bold mb-0">{title ?? 'Project Configuration'}</h5>
            </div>
            <button type="button" className="btn-close border-0 shadow-none" onClick={onClose ?? onCancel}></button>
        </div>}

        <div className="modal-body p-4 pb-2">
            <p className="text-muted" dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>

        <div className="modal-footer border-0">
            <div className="container-fluid">
                <div className="row gap-2 justify-content-end">
                    

                    {/* Confirm */}
                    {onConfirm && <button
                        type="submit" onClick={handleConfirm}
                        className={`btn btn-${confirmColor ?? 'primary'} px-4 order-md-1 ${buttonClass ?? 'col-12 col-lg-auto'}`}>
                        {confirmText ?? 'Confirm'}
                    </button>}
                 
                    {/* Cancel */}
                    {onCancel && <button className={`btn btn-secondary px-4 fw-bold ${buttonClass ?? 'col-12 col-lg-auto'}`} onClick={onCancel}>
                        {cancelText ?? 'Cancel'}
                    </button>}
                </div>
            </div>
        </div>
    </>);
}

export default ConfirmModal;