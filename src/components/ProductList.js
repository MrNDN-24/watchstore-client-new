import { getProducts } from "../services/productService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ProductList = ({ limit, filter }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(currentPage, limit, filter);
        if (!data.success) {
          setProducts([]);
        } else {
          setProducts(data.data.content);
        }
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
    <div className="flex flex-col items-center gap-10 py-8 px-5 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
      {loading ? (
        <p className="text-body-bold dark:text-white">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-body-bold dark:text-white">No products found</p>
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

          {/* <button
            className="mt-8 px-12 py-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 rounded-md transition-colors cursor-pointer text-lg w-[200px] text-center font-medium"
            onClick={goToProductPage}
          >
            Xem thêm
          </button> */}
        </>
      )}
    </div>
  );
};

export default ProductList;
