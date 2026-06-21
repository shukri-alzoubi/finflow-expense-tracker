import React, { useEffect, useMemo, useState } from 'react';
import { useNotifier } from '../../context/Notifier.context';
import { useAuth } from '../../context/Auth.context';
import ConfirmModal from '../../components/modals/Confirm.modal';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import ChangePasswordModal from '../../components/modals/ChangePassword.modal';
import { downloadJSON } from '../../utils/files.util';
import { Link } from 'react-router-dom';
import { useData } from '../../context/Data.context';
import MainLayout from '../../components/layout/MainLayout';
import UsageCard from '../../components/cards/Usage.card';
import { useRestrictions } from '../../hooks/useRestrictions';
import { useCustomer } from '../../context/Customer.context';
import { formatCurrency } from '../../utils/formatCurrency.util';
import DeleteAccountModal from '../../components/modals/DeleteAccount.modal';

const SettingsPage = () => {

    const {
        user,
        updateUserPassword,
        updateDisplayName,
        logout,
        verifyEmail,
        reauthenticate,
        deleteAccount,
    } = useAuth();

    const { customer, currentPlan, updateCustomer } = useCustomer();

    const {
        showModal,
        showLoadingModal,
        closeModal,
        setLoading,
        showToast,
        uploadFile
    } = useNotifier();

    const {
        transactions,
        categories,
    } = useData();

    const {
        canImportData,
        canExportData,
    } = useRestrictions();


    // Change Password
    const handleChangePassword = async () => {
        showModal(<ChangePasswordModal
            onClose={closeModal}
            onSubmit={async (data) => {
                await showLoadingModal(true)
                try {
                    await updateUserPassword(data.current, data.newPassword);
                    setLoading(false, null, 100, () => closeModal());

                    closeModal();
                } catch (error) {
                    if (error.message.includes('wrong-password')) {
                        showToast('Wrong Password', 'danger')
                    }
                    showToast('Something went wrong', 'danger')
                }
                await showLoadingModal(false)
            }}
        />)
    }

    // Sign out
    const handleSignOut = () => {
        showModal(<ConfirmModal
            title={'Sign Out'}
            message={'Do you want to sign out?'}
            confirmText={'Sign Out'}
            cancelText={'Keep me logged In'}
            color={'danger'}
            icon={'bi-box-arrow-right'}
            onClose={closeModal}
            onConfirm={() => {
                logout()
            }}
        />)
    }

    // Delete Account 
    const handleDeleteAccount = () => {
        showModal(<DeleteAccountModal
            onClose={closeModal}
            onConfirm={async (password) => {
                await showLoadingModal(true);
                try {
                    // Authenticate User
                    let authenticated = await reauthenticate(password);

                    if (authenticated) {
                        // Delete User Data
                        const batch = writeBatch(db);

                        // Delete Categories
                        categories.forEach((category) => {
                            const catRef = doc(db, `categories/${category.id}`);
                            batch.delete(catRef);
                        })

                        // Delete Transactions
                        transactions.forEach((transaction) => {
                            const transactionRef = doc(db, `transactions/${transaction.id}`);
                            batch.delete(transactionRef);
                        })

                        // Delete Customer
                        batch.update(doc(db, `users/${user.uid}`), {
                            ...customer,
                            status: 'deleted',
                        })

                        // Commit Batch Changes
                        await batch.commit();
                        let deleted = await deleteAccount(password);
                        if (deleted) {
                            showToast('Account was deleted', 'danger')
                        }
                    }
                } catch (error) {
                    console.log(error);
                    if (error.toString().includes('wrong-password')) {
                        showToast('wrong password', 'danger')
                    } else {
                        showToast('Something went wrong', 'danger')
                    }
                }
                await showLoadingModal(false);
            }}
        />)
    }

    // Display Name
    const handleSaveChanges = async () => {
        await showLoadingModal(true);
        try {
            const displayNameElem = document.getElementById('displayName-input');
            await updateDisplayName(displayNameElem.value)
            showToast('Profile was updated', 'primary')
        } catch (error) {
            console.log(error);
            showToast('Something went wrong', 'danger')
        }
        await showLoadingModal(false);
    }

    // Verify Email Address
    const handleVerifyEmail = async () => {
        await showLoadingModal(true);
        try {
            await verifyEmail();
            showToast('A verification link was sent to your email address', 'success')
        } catch (error) {
            showToast('Something went wrong', 'danger')
        }
        await showLoadingModal(false);
    }

    // Export Data
    const handleExportData = () => {
        canExportData(() => {
            if (categories.length > 0 || transactions.length > 0) {
                downloadJSON({ transactions, categories }, `finflow expense tracker-${new Date().toLocaleString()}`)
            } else {
                showToast('There is no data to be exported.', 'danger')
            }
        })
    }

    // Import Data 
    const handleImportData = async () => {
        canImportData(() => {
            if (categories.length >= 50 || transactions.length >= 50) {
                showToast("You've Rached Your limit of adding data", "danger");
                return;
            }

            uploadFile({
                extentions: '.json',
                onConfirm: async (file) => {
                    if (!file) return;

                    try {
                        // Read the file content as a string
                        const text = await file.text();
                        const data = JSON.parse(text);


                        // Upload Transactions
                        if (data.transactions instanceof Array) {
                            setLoading(true, 'Uploading Transactions ...')
                            const trnsBatch = writeBatch(db);
                            data.transactions.forEach((t) => {
                                trnsBatch.set(doc(db, 'transactions', t.id), { ...t, uid: user.uid, updatedAt: Date.now(), createdAt: Date.now() })
                            });
                            await trnsBatch.commit();
                        }

                        // Upload Categories
                        if (data.categories instanceof Array) {
                            setLoading(true, 'Uploading Categories ...')
                            const catBatch = writeBatch(db);
                            data.categories.forEach((c) => {
                                catBatch.set(doc(db, 'categories', c.id), { ...c, uid: user.uid, updatedAt: Date.now(), createdAt: Date.now() })
                            });
                            await catBatch.commit();
                        }

                        setLoading(false)

                    } catch (err) {
                        setLoading(false, null, 500, () => {
                            showToast('Unable to upload all data', 'danger')
                        })
                        console.error("Error parsing file:", err);
                    }
                }
            })
        })
    }

    // Clear Data
    const handleClearData = () => {
        showModal(<ConfirmModal
            title="Clear Data!"
            message="Do you want to clear all data, that includes all transactions and categories ?"
            confirmText="Clear All Cashed Data"
            cancelText="Keep My Data"
            color="danger"
            icon="bi-trash"
            onClose={closeModal}
            onConfirm={async () => {
                let dbBatch = writeBatch(db);

                // Delete All Data
                try {
                    setLoading(true, 'Deleting Data ...');
                    transactions.forEach((item) => dbBatch.delete(doc(db, 'transactions', item.id)));
                    categories.forEach((item) => dbBatch.delete(doc(db, 'categories', item.id)));
                    await dbBatch.commit();

                    setLoading(false, null, 500, () => showToast('All Data was deleted', 'danger'));
                } catch (error) {
                    setLoading(false, null, 500, () => showToast('Something went wrong', 'danger'));
                }
            }}
        />)
    }


    return (<MainLayout path='/settings'>
        <div className='row'>

            {/* Left Side */}
            {/* ===================================================== */}
            <div className="col-12 col-lg-6">

                {/* Profile */}
                {/* ============================== */}
                <div className="card rounded-4 p-4 shadow-sm mb-4">
                    {/* Header */}
                    <div className="d-flex align-items-center mb-3">
                        <h6 className="fw-bold text-uppercase small text-info text-opacity-75 flex-grow-1">Profile Information</h6>

                        <Link className="mb-1" onClick={handleSaveChanges}>
                            Save Changes
                        </Link>
                    </div>

                    {/* Display Name */}
                    <div className='mb-3'>
                        <label className="form-label small text-secondary fw-bold">FULL NAME</label>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder='Full Name' defaultValue={user.displayName} id='displayName-input' />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="form-label small text-secondary fw-bold">EMAIL ADDRESS</label>
                        <div className="input-group align-items-center">
                            <input type="email" className="form-control" defaultValue={user.email} readOnly />
                            {<div className="input-group-text">
                                {user.emailVerified && <i className="bi bi-check-circle-fill text-success"></i>}
                                {!user.emailVerified && <i className="bi bi-x-circle-fill text-danger"></i>}
                            </div>}
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="form-text text-secondary x-small">Email cannot be changed manually.</div>
                            {!user.emailVerified && <a href="#" className="link-danger ms-auto" style={{ fontSize: 'small' }} onClick={handleVerifyEmail}>verify</a>}
                        </div>
                    </div>
                </div>

                {/* Limits, Usage And Plan */}
                {/* ============================== */}
                <div className="mb-4">
                    <div className="card rounded-4 p-4">
                        <div className="row g-3">
                            <div className="col-12 mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold text-uppercase small text-info text-opacity-75 flex-grow-1">Plan & Usage</h6>

                                    <div className='d-flex gap-2'>

                                        {/* Plan Amount */}
                                        <span className="badge bg-secondary-subtle text-secondary fs-6 px-3 rounded-pill">
                                            ${currentPlan.price.amount}/mo
                                        </span>

                                        {/* Current Plan */}
                                        <span className="badge bg-primary-subtle text-primary fs-6 px-3 rounded-pill">
                                            {customer.plan.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <UsageCard />
                            </div>
                        </div>
                    </div>
                    {currentPlan.planId === 'free' && <div className="text-end mt-2 mx-2">
                        <Link className='text-uppercase small' onClick={() => alert('Redirecting to checkout...')}>Upgrade to pro <i className="bi bi-arrow-right"></i></Link>
                    </div>}
                </div>

            </div>

            {/* Right Side */}
            {/* ===================================================== */}
            <div className="col-12 col-lg-6">

                {/* Security */}
                {/* ============================== */}
                <div className="card rounded-4 p-4 mb-4 shadow-sm ">
                    <div className="d-flex mb-3">
                        <h6 className="fw-bold text-uppercase small text-info text-opacity-75 flex-grow-1">Security</h6>
                    </div>

                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <div className="text-secondary">Manage Your password</div>
                        </div>

                        <div>
                            <button className="btn btn-outline-danger" onClick={handleChangePassword}>
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                {/* ============================== */}
                <div className="card rounded-4 p-4 mb-4 shadow-sm">

                    <div className="row g-3">

                        <div className="col-12 mb-3">
                            <div className="d-flex">
                                <h6 className="fw-bold text-uppercase small text-info text-opacity-75 flex-grow-1">Data Management</h6>
                            </div>
                        </div>

                        {/* Export */}
                        <div className="col-12">
                            <button className="btn btn-outline-info text-start w-100" onClick={handleExportData}>
                                <i className="bi bi-download me-2"></i>Export All Data (.json)
                            </button>
                        </div>

                        {/* Import */}
                        <div className="col-12 col-md">
                            <button className="btn btn-outline-success text-start w-100" onClick={handleImportData}>
                                <i className="bi bi-download me-2"></i>Import Data Archive (.json)
                            </button>
                        </div>

                        <div className="col-12">
                            <button className="btn btn-outline-danger w-100 text-start py-2 px-3 " onClick={handleClearData}>
                                <i className="bi bi-eraser me-2"></i>Clear All Cached Data
                            </button>
                        </div>
                    </div>
                </div>


                {/* Danger Zone */}
                {/* ============================== */}
                <div className="card bg-danger-subtle rounded-4 p-4 mb-4 shadow-sm ">
                    <div className="d-flex mb-3">
                        <h6 className="fw-bold text-uppercase small text-danger text-opacity-75 flex-grow-1">danger Zone</h6>
                    </div>

                    <div className='d-flex flex-column gap-3'>
                        <button className="btn btn-outline-danger w-100" onClick={handleSignOut}>
                            Sign Out
                        </button>

                        <button className="btn btn-danger w-100" onClick={handleDeleteAccount}>
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </MainLayout>);
};

export default SettingsPage;