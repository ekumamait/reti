import { ClockCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader.tsx";
import { useGetProductsQuery } from "../../../services/products.ts";
import { formatRelativeTime } from "../../../utils.ts";
import { Tag } from "antd";

const AllProductsPage = () => {
	const navigate = useNavigate();
	const { data: productsResponse, isLoading } = useGetProductsQuery();

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
					{productsResponse?.data?.map((product) => (
						<div
							key={product.id}
							className="relative flex flex-col p-1 border border-gray-300 rounded-lg bg-white hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
							onClick={() => navigate(`/products/${product.id}`)}
						>
							<div className="p-4">
								<div className="text-right mb-1">
									<div className="">
										<ClockCircleOutlined />  {formatRelativeTime(product.createdAt)}
									</div>
								</div>

								<div className="flex space-x-4">
									<div className="w-1/3">
										<img
											src={product?.imageUrl?.[1] || 'https://via.placeholder.com/300x200'}
											alt={product.name}
											className="w-full h-32 object-cover rounded-lg"
										/>
									</div>
									<div className="w-2/3">
										<h3 className="text-lg font-semibold mb-2">{product.name}</h3>
										<p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
										<div className="flex justify-between items-center">
											<p className="text-sm truncate text-gray-500 flex items-center gap-2">
												<span className="text-gray-400">
													<MoneyCollectOutlined />
												</span>
												{product.price} shs
											</p>
											<Tag className={`px-2 py-1 text-sm ${product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
												}`}>
												{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
											</Tag>
										</div>

									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	)
}

export default AllProductsPage;
