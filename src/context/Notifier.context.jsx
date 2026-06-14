import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Loading from "../components/feedback/Loading";
import { Modal, Toast } from "bootstrap";

const NotifierContext = createContext(null);

export const NotifierProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState({
        enabled: false,
        message: null,
    });

    const setLoading = (enabled = false, message, delay = 1000, onHidden = (() => { })) => {
        if (enabled) {
            setIsLoading({
                enabled: enabled,
                message: message,
            })
        } else {
            setTimeout(() => {
                setIsLoading({
                    enabled: enabled,
                    message: message,
                })

                onHidden();
            }, delay)
        }
    }

    // Modal And Toast
    // ==============================================

    const [modal, setModal] = useState({ isOpen: false, content: null, options: {} });
    const [toast, setToast] = useState({ show: false, message: "", color: "primary" });

    useEffect(() => {

        // Modal
        const modalElement = document.getElementById('notifier-modal');
        const modalCallback = () => { setModal({ isOpen: false, content: null, options: {} }) }
        modalElement.addEventListener('hidden.bs.modal', modalCallback);

        // Toast
        const toastElement = document.getElementById('liveToast');
        const toastCallback = () => { setToast({ show: false, message: "", color: "primary" }) }
        toastElement.addEventListener('hidden.bs.modal', toastCallback);


        return () => {
            modalElement.removeEventListener('hidden.bs.modal', modalCallback);
            toastElement.removeEventListener('hidden.bs.modal', toastCallback);
        }
    }, [])

    const openModal = () => {
        const modal = Modal.getOrCreateInstance(document.getElementById('notifier-modal'));
        modal.show();
    }

    const showModal = useCallback((children, options = {}) => {
        setModal({ isOpen: true, content: children, options });
        openModal();
    }, []);

    const closeModal = useCallback(() => {
        const instance = Modal.getOrCreateInstance(document.getElementById('notifier-modal'));
        instance.hide();
    }, []);


    const showToast = useCallback((message, color = "primary") => {
        setToast({ show: true, message, color });

        // To Give Time for state to change
        setTimeout(() => {
            const instance = Toast.getOrCreateInstance('#liveToast');
            instance.show();
        }, 200);

    }, []);

    // Loading Dialog
    // ===========================================================================
    const loadingModalRef = useRef(null);

    const showLoadingModal = (isLoading) => {
        let instance = Modal.getOrCreateInstance(loadingModalRef.current);

        if (isLoading) {
            const promise = new Promise((resolve, reject) => {
                loadingModalRef.current.addEventListener('shown.bs.modal', () => { resolve() }, { once: true })
                instance.show();
            })
            return promise;
        } else {
            instance.hide();
            const promise = new Promise((resolve, reject) => {
                loadingModalRef.current.addEventListener('hidden.bs.modal', () => { resolve() }, { once: true })

            })
            return promise;
        }
    }

    // File Dialog
    // ===========================================================================
    const fileInputRef = useRef(null);
    const [fileDilogContent, setFileDialogContent] = useState(null);

    // Watch Changes on File Dialog Content State
    useEffect(() => {
        if (fileInputRef.current && fileDilogContent) {
            fileInputRef.current.click();
        }
    }, [fileDilogContent])

    // Set File Dialog Content
    const uploadFile = (content) => {

        // Clear Content After Confirm
        let callback = content.onConfirm;
        content.onConfirm = (file) => {
            callback(file);
            setFileDialogContent(null)
        }

        // Set File Dialog Content Content
        setFileDialogContent(content);
    }

    const values = {
        isLoading,
        setLoading,
        showModal,
        closeModal,
        showLoadingModal,
        showToast,
        uploadFile,
    }


    return <NotifierContext.Provider value={values}>
        {/* Loading */}
        {isLoading.enabled && <div className="z-top"><Loading message={isLoading.message} /></div>}

        {/* Children */}
        <div className={`${isLoading.enabled && 'd-none'}`}>{children}</div>

        {/* --- Bootstrap Modal Markup --- */}
        <div
            id="notifier-modal"
            className={`modal fade ${modal.options.custom && 'modal-transparent'}`} tabIndex="-1"
            data-bs-backdrop={'static'}
            onClick={!modal.options?.static ? closeModal : (()=>{})}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className={`
                    modal-dialog modal-dialog-centered
                    ${modal.options.size ?? ''} 
                    ${(modal.options.scrollable == null || modal.options.scrollable) && 'modal-dialog-scrollable'}
                `}
                onClick={(e) => e.stopPropagation()}>

                {/* Modal Content */}
                <div
                    className="modal-content border-0 shadow-lg"
                    style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
                    {modal.content}
                </div>
            </div>
        </div>

        {/* --- Bootstrap Toast Markup --- */}
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" className={`toast text-bg-${toast?.color ?? 'primary'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className={` d-flex `}>
                    <div className="toast-body">
                        {toast?.message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>

        {/* Loading Modal */}
        <div
            ref={loadingModalRef}
            id="loading-modal"
            className="modal fade"
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex="-1" aria-hidden="true">
            {/* Close Modal Button */}
            <div className='modal-dialog modal-sm modal-dialog-centered'>
                {<LoadingDialog />}
            </div>
        </div>

        {/* Upload File Input */}
        <FileDialog ref={fileInputRef} content={fileDilogContent} />

    </NotifierContext.Provider>
}

/**
 * 
 * @returns {{
 * uploadFile : (content: FileDialogContent) => void,
 * setLoading : (enabled: boolean, message: string | null, delay: number, onHidden: ()=> void) => void,
 * showModal : (
 *      children, 
 *      options: {
 *          size: 'modal-sm' | 'modal-md' | 'modal-lg' | 'modal-xl' | 'modal-fullscreen' | null,
 *          scrollable: boolean,
 *          custom: boolean,
*           static: boolean,
 *      }) => void,
 * showLoadingModal : (isLoading: Boolean) => Promise<void>,
 * closeModal: ()=>void,
 * showToast: (message: string, color: string) => void,
 * }}
 */
export const useNotifier = () => useContext(NotifierContext)


/**
 * 
 * @param {Object} obj
 * @param {FileDialogContent} obj.content
 * @param {any} obj.ref 
 * @returns 
 */
export const FileDialog = ({ ref, content }) => {

    // Check if the file is selected
    const submitFile = (e) => {
        let file = e.target.files[0];
        if (file) {
            content.onConfirm && content.onConfirm(file);
        }
    }

    return (<div className="upload-file-dialog">
        <input
            type="file" onChange={submitFile}
            ref={ref} accept={content?.extentions ?? '.pdf'}
            id="upload-file-dialog-input" className="d-none" />
    </div>)
}

export class FileDialogContent {
    /** @type {String} e.g.  (.pdf, .png, ...) */ extentions
    /** @type {(file: File)=> void} */ onConfirm
}

export const LoadingDialog = ({ color = 'primary' }) => {
    return (<div className="d-flex justify-content-center align-items-center w-100 loading-dialog">
        <div className="card aspect-1 p-4 opacity-75 ">
            <div className={`spinner-border text-${color} custom-spinner`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>)
}