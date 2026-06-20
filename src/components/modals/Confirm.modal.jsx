const ConfirmModal = ({
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    icon = 'bi-exclamation-octagon',
    color = 'danger',
    onClose,
}) => {

    const handleConfirm = () => {
        onConfirm?.();
        onClose?.()
    }

    return (<div className="p-4 text-center">

        {/* Icon */}
        <div
            className={`bg-${color ?? 'danger'} bg-opacity-10 text-${color ?? 'danger'} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
            style={{ width: '64px', height: '64px' }}>
            <i className={`bi ${icon ?? 'bi-exclamation-octagon'} fs-2`}></i>
        </div>

        {/* Content */}
        <h5 className="fw-bold text-white">{title}</h5>
        <p className="text-body-tertiary small" dangerouslySetInnerHTML={{ __html: message }}></p>

        {/* Actions */}
        <div className="d-flex flex-column gap-3 mt-4">
            <button className={`btn btn-${color ?? 'danger'} fw-bold`} onClick={onConfirm}>
                {confirmText ?? 'Confirm'}
            </button>

            <button className="btn btn-link text-muted text-decoration-none w-100 btn-sm" onClick={onClose}>
                {cancelText ?? 'Discard'}
            </button>
        </div>

    </div>);
}

export default ConfirmModal;