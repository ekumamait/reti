import { useState } from "react";
import { Button, Layout, Input, Select } from "antd";
import Header from "../../../components/secondary/Header";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import AddProductForm from "../Forms/AddProductForm";
import { loginDetails } from "../../../utils";
import AllProductsPage from "./AllProducts.tsx";
import Chat from "../../../components/secondary/Chat.tsx";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(9);
  const [searchText, setSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

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

  const handleProductPageChange = (page: number) => {
    setProductPage(page);
  };

  const handleProductPageSizeChange = (size: number) => {
    setProductPageSize(size);
    setProductPage(1);
  };

  return (
    <>
      <Header pageTitle="Products" />
      <CustomDashboardLayout>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 gap-4">
            <Search
              placeholder="Search by name or description"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setStockFilter}
            >
              <Option value="all">Show All</Option>
              <Option value="inStock">In Stock</Option>
              <Option value="outOfStock">Out of Stock</Option>
            </Select>
          </div>
          
          {loginDetails().user.role === "youth" && (
            <Button type="primary" onClick={showModal} className="ml-auto">
              Add New Product
            </Button>
          )}
        </div>

        <AddProductForm
          onOk={handleOk}
          onCancel={handleCancel}
          open={open}
          loading={loading}
          initialData={undefined}
        />
        <Layout>
          <AllProductsPage
            currentPage={productPage}
            pageSize={productPageSize}
            onPageChange={handleProductPageChange}
            onPageSizeChange={handleProductPageSizeChange}
            searchText={searchText}
            stockFilter={stockFilter}
          />
        </Layout>
      </CustomDashboardLayout>
      {loginDetails().user.role !== "admin" && <Chat />}
    </>
  );
};

export default ProductsPage;
