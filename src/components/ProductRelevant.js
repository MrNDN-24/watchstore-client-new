import { getProducts } from "../services/homeService";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

const ProductRelevant = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // State cho trang hiện tại
  const [postPerPage, setPostPerPage] = useState(5);
  const [pageSize, setPageSize] = useState(1); // Số trang tổng cộng

  // const firstPostIndex = lastPostIndex - postPerPage;
  // const lastPostIndex = page * postPerPage;
  // const currentPost = products.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("page", page);
        const data = await getProducts(page);
        const ProductList = Array.isArray(data.data.content)
          ? data.data.content
          : [data.data.content];
        setProducts(ProductList);
        console.log("data content:", ProductList);
        setPageSize(data.data.pagination.pageSize);

        // console.log("pagesize:", data.data.pagination.pageSize);
        // console.log("Product list:", data);
        // console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // Giảm số trang hiện tại
    }
  };

  const handleNextPage = () => {
    if (page < pageSize) {
      setPage(page + 1); // Tăng số trang hiện tại
    }
  };
  let pagesList = [];
  for (let i = 1; i <= pageSize; i++) {
    pagesList.push(i);
  }
  // console.log("Pagelist :", pagesList);
  // console.log("pagesize :", pageSize);

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold text-3xl font-extrabold">
        Đồng hồ bán chạy
      </p>
      {loading ? (
        <p className="text-body-bold">Loading...</p>
      ) : !products || products.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <div className="flex justify-center gap-4 mt-8">
        <button // Thay div bằng button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 text-white rounded-md ${
            page === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black cursor-pointer"
          }`}
        >
          <MdArrowBackIos />
        </button>

        <button // Thay div bằng button
          onClick={handleNextPage}
          disabled={page === pageSize}
          className={`px-4 py-2 text-white rounded-md ${
            page === pageSize
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black cursor-pointer"
          }`}
        >
          <MdArrowForwardIos />
        </button>
      </div>

      {/* Optional: Add page indicator */}
      <div className="text-sm">
        Trang {page} / {pageSize}
      </div>
      <div
        className="mt-8 px-12 py-3 bg-black hover:bg-gray-800 text-white rounded-md transition-colors cursor-pointer text-lg w-[200px] text-center font-medium"
        onClick={() => {
          // Xử lý logic xem thêm sản phẩm ở đây
          // Ví dụ: tăng số lượng sản phẩm hiển thị hoặc chuyển trang
        }}
      >
        Xem thêm
      </div>
    </div>
  );
};

export default ProductRelevant;
