import { ClockCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader.tsx";
import { formatRelativeTime } from "../../../utils.ts";
import { Tag } from "antd";
import Pagination from "../../../components/secondary/Pagination";
import { useState, useEffect } from "react";
import { Empty } from 'antd';

const AllProductsPage = ({
  currentPage,
  onPageChange,
  onPageSizeChange,
  searchText,
  stockFilter,
  products,
  isLoading
}) => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(window.innerWidth >= 1536 ? 9 : 6);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth >= 1536 ? 9 : 6);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = products?.data?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.stockQuantity > 0) ||
      (stockFilter === "outOfStock" && product.stockQuantity === 0);

    return matchesSearch && matchesStock;
  });

  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (

        <div>
          {filteredProducts && filteredProducts && paginatedProducts?.length === 0 ? (<div className="mt-32">
            <Empty />
          </div>) : (

            <div className="relative">
              {/* Product Grid */}
              <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts?.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="h-34 relative flex flex-col p-1 border border-gray-300 rounded-lg bg-white hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-4">
                      <div className="text-right mb-1">
                        <div className="">
                          <ClockCircleOutlined />{" "}
                          {formatRelativeTime(product.createdAt)}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <div className="w-1/3">
                          <img
                            src={
                              product?.imageUrl?.[0] ||
                              "https://via.placeholder.com/300x200"
                            }
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="w-2/3">
                          <h3 className="text-lg font-semibold mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm truncate text-gray-500 flex items-center gap-2">
                              <span className="text-gray-400">
                                <MoneyCollectOutlined />
                              </span>
                              {product.price} shs
                            </p>
                            <Tag
                              className={`px-2 py-1 text-sm ${product.stockQuantity > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {product.stockQuantity > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts && filteredProducts?.length > pageSize && (
                <>
                  {/* Desktop Pagination */}
                  <div className="mt-4 fixed bottom-0 p-4 ">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredProducts.length / pageSize)}
                      pageSize={pageSize}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                    />
                  </div>

                  {/* Mobile Pagination */}
                  <div className=" p-4 sm:hidden w-full z-50 mb-16">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredProducts.length / pageSize)}
                      pageSize={pageSize}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllProductsPage;
