import { useState } from 'react';
import { Button, Layout } from 'antd';
import Header from '../../../components/secondary/Header';
import CustomDashboardLayout from '../../../components/secondary/CustomDashboardPagesLayout';
import AddProductForm from '../Forms/AddProductForm';
import { loginDetails } from '../../../utils';
import AllProductsPage from './AllProducts.tsx';
import Chat from '../../../components/secondary/Chat.tsx';

const ProductsPage = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

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
