import MainLayout from "../../components/layout/MainLayout";
import CategoryModal from "../../components/modals/Category.modal";
import ConfirmModal from "../../components/modals/Confirm.modal";
import { useData } from "../../context/Data.context";
import { useNotifier } from "../../context/Notifier.context";
import { formatDate, isSameMonth } from "../../utils/date.util";
import { formatCurrency } from "../../utils/formatCurrency.util";
import { useMemo } from "react";
import { Category } from "../../models/Category.model";
import { LazyItem } from "../../components/utils/LazyItem";
import { useRestrictions } from "../../hooks/useRestrictions";
import CategoryCard from "../../components/cards/Category.card";

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

    const { canAddCategory } = useRestrictions();

    // An Object Of categories and spending amounts
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

    // Add New Category
    const handleAddCategory = async () => {
        canAddCategory(() => {
            showModal(<CategoryModal
                isNew
                onClose={closeModal}
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
        })
    }

    // Update Category
    const handleUpdateCategory = (category) => {
        showModal(<CategoryModal
            initialValue={category}
            onClose={closeModal}
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

    // Delete Category
    const handleDeleteCategory = (category) => {
        showModal(<ConfirmModal
            title="Delete"
            message={`Do you want to delete <span class="text-info">${category.name}</span> ?`}
            confirmText="Delete Category"
            color="danger"
            icon={'bi-trash'}
            onClose={closeModal}
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
        <div className="row g-3 mb-4">
            <div className="col-12 col-md">
                <h2 className="fw-bold mb-0">Categories</h2>
                <p className="text-muted small mb-0">Manage labels and monthly budget limits.</p>
            </div>

            {/* Add New Category Button */}
            <div className="col-12 col-md-auto">
                <button className="w-100 btn btn-primary px-4 fw-bold shadow-sm" onClick={handleAddCategory}>
                    <i className="bi bi-plus-lg me-2"></i>New Category
                </button>
            </div>

        </div>


        {/* Categories */}
        {/* ================================ */}
        <div className="row g-4">
            {categories.map((category) =>
                <div key={category.id} className="col-md-4">
                    <LazyItem>
                        <CategoryCard
                            category={category}
                            spent={budgets[category.id]}
                            onEdit={() => handleUpdateCategory(category)}
                            onDelete={() => handleDeleteCategory(category)}
                        />
                    </LazyItem>
                </div>
            )}

            {/* New Category / Show When there are no categoies */}
            {categories.length === 0 && <div className="col-md-4">
                <div className="card transition-card p-4 shadow-sm border-dashed d-flex align-items-center justify-content-center text-center py-5 pointer bg-transparent"
                    style={{ border: "2px dashed #dee2e6" }} onClick={handleAddCategory}>
                    <div>
                        <i className="bi bi-plus-circle fs-2 text-muted mb-2"></i>
                        <p className="text-muted small fw-bold mb-0">Create Custom<br />Category</p>
                    </div>
                </div>
            </div>}
        </div>
    </MainLayout>);
}

export default CategoriesPage;