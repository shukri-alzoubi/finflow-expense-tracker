import { useMemo } from 'react';
import mock_plans from '../assets/mock/plans.mock.json';
import { useCustomer } from '../context/Customer.context';
import { useData } from '../context/Data.context';
import { useNotifier } from '../context/Notifier.context';
import RestrictionModal from '../components/modals/Restriction.modal';

export const useRestrictions = () => {

    const {
        showModal,
        closeModal,
    } = useNotifier();


    const { transactions, categories } = useData();
    const { customer } = useCustomer();

    const limits = useMemo(() => mock_plans[customer?.plan?.id ?? 'free'].limits, [customer]);
    const permissions = useMemo(() => mock_plans[customer?.plan?.id ?? 'free'].permissions, [customer]);
    const proPlan = mock_plans.pro;

    // Check Transactions Limit
    const canAddTransaction = (successCallback) => {
        if (limits?.transactions && (limits.transactions > transactions.length || limits.transactions === -1)) {
            successCallback?.()
        } else if (limits?.transactions) {
            showModal(<RestrictionModal
                type='limit'
                name='transactions'
                value={limits?.transactions}
                price={proPlan.price}
                onClose={closeModal}
                onUpgrade={() => {
                    closeModal();
                    alert('Redirecting to checkout...')
                }}
            />)
        }
    }

    // Check Categories Limit
    const canAddCategory = (successCallback) => {
        if (limits?.categories && (limits.categories > categories.length || limits.categories === -1)) {
            successCallback?.();
        } else if (limits?.categories) {
            showModal(<RestrictionModal
                type='limit'
                name='categories'
                value={limits?.categories}
                price={proPlan.price}
                onClose={closeModal}
                onUpgrade={() => {
                    closeModal();
                    alert('Redirecting to checkout...')
                }}
            />)
        }
    }

    // Can Import Data
    const canImportData = (successCallback) => {
        if (permissions?.import) {
            successCallback?.()
        } else {
            showModal(<RestrictionModal
                type='permission'
                name='Data Import'
                price={proPlan.price}
                onClose={closeModal}
                onUpgrade={() => {
                    closeModal();
                    alert('Redirecting to checkout...')
                }}
            />)
        }
    }

    // Can Export Data
    const canExportData = (successCallback) => {
        if (permissions?.import) {
            successCallback?.()
        } else {
            showModal(<RestrictionModal
                type='permission'
                name='Data Export'
                price={proPlan.price}
                onClose={closeModal}
                onUpgrade={() => {
                    closeModal();
                    alert('Redirecting to checkout...')
                }}
            />)
        }
    }


    return {
        canAddTransaction,
        canAddCategory,
        canImportData,
        canExportData,
    }

}