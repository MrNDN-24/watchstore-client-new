import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../services/blogService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchBlogs();
  }, [search, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const result = await getBlogs(search, page, limit);
      setBlogs(result.blogs);
      setTotalPages(result.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: "Tin tức", value: "news" },
    { label: "Mẹo", value: "tips" },
    { label: "Công nghệ", value: "technology" },
    { label: "Tính năng độc đáo", value: "unique_features" },
    { label: "Chứng nhận", value: "certifications" },
    { label: "Chế tác chất liệu", value: "material_crafting" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Danh mục
              </h3>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => {
                        setSearch(cat.value);
                        setPage(1);
                      }}
                      className={`w-full text-left px-2 py-1 rounded transition hover:bg-red-100 dark:hover:bg-gray-700 ${
                        search === cat.value
                          ? "bg-red-200 dark:bg-red-600 font-semibold text-black dark:text-white"
                          : ""
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Blog List */}
          <main className="md:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center text-red-600 font-semibold">
                Đang tải bài viết...
              </div>
            ) : blogs.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                Không tìm thấy bài viết nào.
              </p>
            ) : (
              blogs.map((blog) => (
                <Link
                  to={`/blogs/${blog._id}`}
                  key={blog._id}
                  className="flex gap-4 border-b pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-md border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={blog.image_url || "/NEWS.jpg"}
                    alt={blog.title}
                    className="w-40 h-28 object-cover rounded-md shadow-sm"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-red-600 text-left">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-1 text-left">
                        {categories.find((cat) => cat.value === blog.type)
                          ?.label || "Khác"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 text-left">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(blog.publishDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </main>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 mb-8">
        <nav className="inline-flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600"
                  : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              } hover:bg-red-100 dark:hover:bg-gray-700 transition`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            &gt;
          </button>
        </nav>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
