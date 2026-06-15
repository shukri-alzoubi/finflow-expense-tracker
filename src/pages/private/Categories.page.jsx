import MainLayout from "../../components/layout/MainLayout";
import CategoryModal from "../../components/modals/Category.modal";
import ConfirmModal from "../../components/modals/Confirm.modal";
import { useData } from "../../context/Data.context";
import { useNotifier } from "../../context/Notifier.context";
import { formatDate } from "../../utils/date.util";
import { formatCurrency } from "../../utils/formatCurrency.util";
import { useMemo } from "react";
import { Category } from "../../models/Category.model";
import { LazyItem } from "../../components/utils/LazyItem";

const CategoriesPage = () => {
    const {
        showModal,
        closeModal,
        showLoadingModal,
        showToast,
    } = useNotifier();

    const {
        categories,
        transactions,
        insertDocument,
        updateDocument,
        deleteDocument,
    } = useData();


    const budgets = useMemo(() => {
        let budgets = {};

        transactions
            .filter((t) => isSameMonth(t.date, Date.now()))
            .forEach((t) => {
                if (budgets[t.categoryId]) budgets[t.categoryId] += parseFloat(t.amount)
                else budgets[t.categoryId] = parseFloat(t.amount);
            });

        return budgets;
    }, [transactions, categories])

    const handleAddCategory = async () => {
        showModal(<CategoryModal
            onCancel={closeModal}
            onSubmit={async (newCategory) => {
                await showLoadingModal(true);
                try {
                    await insertDocument('categories', newCategory)
                } catch (error) {
                    console.log(error.message);
                    showToast('Something went wrong', 'danger');
                }
                await showLoadingModal(false);
            }}
        />);
    }

    const handleUpdateCategory = (category) => {
        showModal(<CategoryModal
            initialValue={category}
            onCancel={closeModal}
            onSubmit={async (newCategory) => {
                await showLoadingModal(true);
                try {
                    await updateDocument('categories', category.id, newCategory)
                } catch (error) {
                    console.log(error.message);
                    showToast('Something went wrong', 'danger');
                }
                await showLoadingModal(false);
            }}
        />);
    }

    const handleDeleteCategory = (category) => {
        showModal(<ConfirmModal
            title="Delete"
            message={`Do you want to delete ${category.name} ?`}
            confirmText="Delete"
            confirmColor="danger"
            onCancel={closeModal}
            onConfirm={async () => {
                await showLoadingModal(true);
                try {
                    deleteDocument('categories', category.id)
                    showToast('Category was deleted', 'danger');
                } catch (error) {
                    console.log(error.message);
                    showToast('Something went wrong', 'danger');
                }
                await showLoadingModal(false);

            }}
        />)
    }

    return (<MainLayout path="/categories">

        {/* Header */}
        {/* ================================ */}
        <div className="row align-items-center g-3 mb-4">
            <div className="col-12 col-md">
                <h2 className="fw-bold mb-0">Categories</h2>
                <p className="text-muted small mb-0">Manage labels and monthly budget limits.</p>
            </div>

            <div className="col-12 col-md-auto">
                <button className="btn btn-primary px-4 fw-bold shadow-sm w-100" onClick={handleAddCategory}>
                    <i className="bi bi-plus-lg me-2"></i>New Category
                </button>
            </div>

        </div>


        {/* Categories */}
        {/* ================================ */}
        <div className="row g-4">
            {categories.map((category) => {
                const spent = budgets[category.id];
                let progress = 0;
                if (spent && (category.budget ?? '') !== '' && !isNaN(parseFloat(category.budget)) && parseFloat(category.budget) > 0) {
                    progress = (spent / category.budget) * 100
                };

                return (
                    <div key={category.id} className="col-md-4">
                        <LazyItem>
                            <div className="card transition-card p-4 shadow-sm">

                                <div className="d-flex justify-content-between align-items-start mb-4">

                                    <div className={`icon-box bg-${category.color}-subtle text-${category.color}`}>
                                        <i className={`${category.icon}`}></i>
                                    </div>

                                    <div className="dropdown">
                                        <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown"><i className="bi bi-three-dots-vertical"></i></button>
                                        <ul className="dropdown-menu border-0 shadow-sm">
                                            <li><button className="dropdown-item small" onClick={() => handleUpdateCategory(category)}>Edit</button></li>
                                            <li><button className="dropdown-item small text-danger" onClick={() => handleDeleteCategory(category)}>Delete</button></li>
                                        </ul>
                                    </div>

                                </div>

                                <h5 className="fw-bold mb-1">{category.name}</h5>
                                <p className="text-muted small mb-3">{formatDate(category.updatedAt)}</p>

                                <div>
                                    <div className="d-flex justify-content-between small fw-bold mb-1">
                                        <span className="text-secondary">Spent: {formatCurrency(spent ?? 0)}</span>
                                        <span className="text-muted">Limit: {formatCurrency(category.budget ?? 0)}</span>
                                    </div>
                                    <div className="progress mb-2">
                                        <div className={`progress-bar bg-${progress > 90 ? 'danger' : progress > 75 ? 'warning' : progress > 35 ? 'primary' : 'success'}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                    {progress > 75 && <span className="text-warning fw-bold" style={{ fontSize: "11px" }}>
                                        <i className="bi bi-exclamation-circle me-1"></i>{(progress).toFixed(0)}% of budget used
                                    </span>}
                                </div>

                            </div>
                        </LazyItem>
                    </div>
                )
            })}

            {/* New Category */}
            <div className="col-md-4">
                <div className="card transition-card p-4 shadow-sm border-dashed d-flex align-items-center justify-content-center text-center py-5 pointer bg-transparent"
                    style={{ border: "2px dashed #dee2e6" }} onClick={handleAddCategory}>
                    <div>
                        <i className="bi bi-plus-circle fs-2 text-muted mb-2"></i>
                        <p className="text-muted small fw-bold mb-0">Create Custom<br />Category</p>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>);
}

export default CategoriesPage;