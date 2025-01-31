import React, { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../../../services/products';
import { Button, Layout } from 'antd';
import { DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/secondary/Header';
import CustomDashboardLayout from '../../../components/secondary/CustomDashboardPagesLayout';
import AddProductForm from '../Forms/AddProductForm';
import DeletePopconfirm from '../../../components/secondary/CustomDeletePopUp';
import DateCheckComponent from '../../../components/primary/dataChecker';
import Loader from '../../loader.tsx';
import { loginDetails } from '../../../utils';
import { toast } from 'react-toastify';
import AllProductsPage from './AllProducts.tsx';
import Chat from '../../../components/secondary/Chat.tsx';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [deleteProduct] = useDeleteProductMutation();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            await deleteProduct(productId).unwrap();
            toast.success('Product deleted successfully.');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <>
            <Header pageTitle="Products" />
            <CustomDashboardLayout>
                {loginDetails().user.role === 'youth' && (
                    <div className="flex items-center justify-end mb-4">
                        <div>
                            <Button type="primary" onClick={showModal}>
                                Add New Product
                            </Button>
                            <AddProductForm
                                onOk={handleOk}
                                onCancel={handleCancel}
                                open={open}
                                loading={loading}
                                initialData={undefined} />
                        </div>
                    </div>
                )}

                <Layout>
                    <AllProductsPage />
                </Layout>
            </CustomDashboardLayout>
            {loginDetails().user.role !== 'admin' && <Chat />}
        </>
    )
}

export default ProductsPage;
