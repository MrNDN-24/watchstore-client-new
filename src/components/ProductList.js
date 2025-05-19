import { getProducts } from "../services/productService";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

const ProductList = ({ limit, filter }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [page, setPage] = useState(1); // State cho trang hiện tại
  const [pageSize, setPageSize] = useState(1); // Số trang tổng cộng
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("Product Filters:", filter);
        const data = await getProducts(currentPage, limit, filter);
        if (!data.success) {
          setProducts([]);
        } else {
          setProducts(data.data.content);
        }
        // const ProductList = Array.isArray(data.data.content)
        //   ? data.data.content
        //   : [data.data.content];

        // console.log("data content:", data);
        setPageSize(data.data.pagination.pageSize);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, filter]);

  const goToProductPage = () => {
    navigate("/product", { state: { filters: filter } });
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      {loading ? (
        <p className="text-body-bold">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-16">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            totalPages={pageSize}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
          <button
            className="mt-8 px-12 py-3 bg-black hover:bg-gray-800 text-white rounded-md transition-colors cursor-pointer text-lg w-[200px] text-center font-medium"
            onClick={
              // Xử lý logic xem thêm sản phẩm ở đây
              goToProductPage
            }
          >
            Xem thêm
          </button>
        </>
      )}
    </div>
  );
};

export default ProductList;
