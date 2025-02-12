import { useParams, useNavigate } from "react-router-dom";
import CustomAppTitle from "../../../components/secondary/CustomAppTitle";
import { Avatar, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import { formatDistanceToNow } from "../../../utils";
import {
  EditOutlined,
  ShoppingOutlined,
  MoneyCollectOutlined,
  TagOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import {
  useGetProductDetailsQuery,
  useDeleteProductMutation,
} from "../../../services/products";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import { useState } from "react";
import AddProductForm from "../Forms/AddProductForm";
import { loginDetails } from "../../../utils";
import { toast } from "react-toastify";
import Loader from "../../loader";
import Chat from "../../../components/secondary/Chat";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data, isLoading } = useGetProductDetailsQuery(id);
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();
  const productCreatedDate = new Date(data?.data.createdAt);
  const user = loginDetails();
  const [receiverId, setReceiverId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSendMessage = () => {
    const creatorId = data?.data?.userId;
    if (creatorId) {
      setReceiverId(creatorId);
    }
  };

  const handleNextImage = (e: React.MouseEvent, maxLength: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % maxLength);
  };

  const handlePrevImage = (e: React.MouseEvent, maxLength: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + maxLength) % maxLength);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(id || "").unwrap();
      toast.success("Product deleted successfully");
      navigate("/products");
    } catch (error) {
      toast.error(`Failed to delete product ${error.message}`);
    }
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const formattedInitialData = data?.data
    ? {
        id: data.data.id,
        name: data.data.name,
        category: data.data.category,
        description: data.data.description,
        price: data.data.price,
        stockQuantity: data.data.stockQuantity,
        imageUrl: data.data.imageUrl,
      }
    : null;

  return (
    <div>
      <Header pageTitle="Product Details" />
      <CustomAppTitle showBackButton={true}></CustomAppTitle>
      <CustomDashboardLayout>
        {isLoading ? (
          <Loader />
        ) : (
          <Content className="bg-white mt-2 border border-gray-900/10 rounded-lg relative w-full max-w-3xl">
            <div className="sm:flex justify-between">
              <div className="sm:w-8/12 border-r border-gray-200 p-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {data?.data.name}
                  </h1>
                  <div className="relative w-full flex justify-center" >
                    {data?.data?.imageUrl &&
                    Array.isArray(data.data.imageUrl) &&
                    data.data.imageUrl.length > 0 ? (
                      <>
                        <img
                          src={data.data.imageUrl[currentImageIndex]}
                          alt={data.data.name}
                          className="w-full h-auto min-w-[250px] max-w-full rounded-lg"
                        />
                        {data.data.imageUrl.length > 1 && (
                          <>
                            <button
                              onClick={(e) =>
                                handlePrevImage(e, data.data.imageUrl.length)
                              }
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                            >
                              <LeftOutlined />
                            </button>
                            <button
                              onClick={(e) =>
                                handleNextImage(e, data.data.imageUrl.length)
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                            >
                              <RightOutlined />
                            </button>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {data.data.imageUrl.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    index === currentImageIndex
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src="https://via.placeholder.com/300x200"
                        alt="Placeholder"
                        className="w-full h-auto min-w-[250px] max-w-full rounded-lg"
                      />
                    )}
                  </div>

                  <p className="text-md text-gray-700 mb-6">
                    {data?.data.description}
                  </p>

                  <Button
                    className="mt-4"
                    type="primary"
                    onClick={handleSendMessage}
                  >
                    Start Chat
                  </Button>
                </div>
              </div>

              <div className="w-7/12">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Product Info
                  </h3>
                  <div className="flex items-center gap-x-3">
                    <Avatar icon={<ShoppingOutlined />} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {data?.data.name}
                      </h4>
                      <p className="text-md text-gray-600">
                        Posted {formatDistanceToNow(productCreatedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <TagOutlined />
                      </span>
                      Category: {data?.data.category}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <MoneyCollectOutlined />
                      </span>
                      Price: {data?.data.price} shs
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <ShoppingOutlined />
                      </span>
                      Stock: {data?.data.stockQuantity} units
                    </p>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        data?.data.stockQuantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {data?.data.stockQuantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(user?.user?.id === data?.data?.userId &&
              user?.user?.role === "youth") ||
              (user?.user?.role === "super" && (
                <div className="absolute bottom-4 right-4 space-y-2">
                  <div>
                    <DeletePopconfirm
                      title="Delete Product"
                      description="Are you sure to delete this product?"
                      onConfirm={handleDeleteProduct}
                      onConfirmMessage="Product deleted successfully"
                      onCancelMessage="Product deletion cancelled"
                      okText="Yes"
                      cancelText="No"
                    />
                  </div>
                  <div>
                    <EditOutlined
                      onClick={() => setIsEditOpen(true)}
                      className="text-blue-500 cursor-pointer text-lg"
                    />
                  </div>
                </div>
              ))}

            {user?.user?.role === "youth" && (
              <AddProductForm
                onCancel={handleCancel}
                onOk={() => setIsEditOpen(false)}
                open={isEditOpen}
                loading={false}
                initialData={formattedInitialData}
                isEdit={true}
              />
            )}
          </Content>
        )}
      </CustomDashboardLayout>
      <Chat receiverId={receiverId} />
    </div>
  );
};

export default ProductDetailsPage;