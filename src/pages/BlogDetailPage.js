import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById, getBlogs } from "../services/blogService"; // bổ sung getBlogs
import { getCommentsByBlogId, postComment } from "../services/commentService";
import BlogContent from "../components/BlogContent";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [toc, setToc] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]); // thêm trạng thái lưu bài viết cùng loại

  const contentRef = useRef(null);

  const categories = [
    { label: "Tin tức", value: "news" },
    { label: "Mẹo", value: "tips" },
    { label: "Công nghệ", value: "technology" },
    { label: "Tính năng độc đáo", value: "unique_features" },
    { label: "Chứng nhận", value: "certifications" },
    { label: "Chế tác chất liệu", value: "material_crafting" },
  ];

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.userId;
    } catch {
      return null;
    }
  };

  const fetchComments = async () => {
    const result = await getCommentsByBlogId(id);
    if (result.success) {
      setComments(result.data);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }
    if (!commentContent.trim()) {
      alert("Nội dung bình luận không được để trống");
      return;
    }

    const commentData = {
      blogId: id,
      userId,
      content: commentContent.trim(),
    };

    const result = await postComment(commentData);
    if (result.success) {
      alert("Bình luận đã được gửi");
      setCommentContent("");
      fetchComments();
    } else {
      alert("Gửi bình luận thất bại: " + result.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const blogData = await getBlogById(id);
      setBlog(blogData);
      setLoading(false);
      fetchComments();

      // Lấy danh sách bài viết cùng loại
      if (blogData?.type) {
        const relatedResult = await getBlogs(blogData.type, 1, 5);
        console.log("Related blogs result:", relatedResult.blogs);
        if (
          relatedResult &&
          relatedResult.success &&
          Array.isArray(relatedResult.blogs)
        ) {
          // Lọc bỏ bài hiện tại
          const filtered = relatedResult.blogs.filter((b) => b._id !== id);
          console.log("Related blogs:", filtered);
          setRelatedBlogs(filtered);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h1, h2, h3");
    const tocData = [];

    headings.forEach((heading, index) => {
      const text = heading.innerText || heading.textContent;
      const slug = `toc-${index}`;
      heading.setAttribute("id", slug);
      heading.classList.add("heading-offset"); // Để tránh navbar che mất
      tocData.push({ id: slug, text, level: heading.tagName });
    });

    setToc(tocData);
  }, [blog]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Đang tải...
      </div>
    );

  if (!blog)
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Không tìm thấy bài viết.
      </div>
    );

  const blogTypeLabel =
    categories.find((cat) => cat.value === blog.type)?.label || "Không rõ loại";

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Hình ảnh */}
        <img
          src={blog.image_url || "/NEWS.jpg"}
          alt={blog.title}
          className="w-full h-auto rounded mb-4 shadow"
        />

        {/* Ngày đăng + Loại bài viết */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            Ngày đăng: {new Date(blog.publishDate).toLocaleDateString("vi-VN")}
          </span>
          <span className="italic text-red-500 font-medium">
            {blogTypeLabel}
          </span>
        </div>

        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="mb-4 text-sm text-gray-600 dark:text-gray-400 bg-transparent dark:bg-transparent relative"
        >
          <ol className="flex space-x-2">
            <li>
              <a
                href="/"
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                Trang chủ
              </a>
            </li>
            <li>/</li>
            <li>
              <a
                href="/blog"
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                Blog
              </a>
            </li>
            <li>/</li>
            <li
              className="text-gray-900 dark:text-white font-semibold truncate max-w-xs"
              title={blog.title}
            >
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-red-600 mb-4">{blog.title}</h1>

        {/* Mục lục */}
        {toc.length > 0 && (
          <div className="border-l-4 border-red-600 pl-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              Mục lục
            </h2>
            <ul className="space-y-1 text-sm">
              {toc.map((item, idx) => (
                <li
                  key={idx}
                  className={`ml-${
                    item.level === "H2" ? 2 : item.level === "H3" ? 4 : 0
                  }`}
                >
                  <a
                    href={`#${item.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nội dung */}
        <BlogContent blog={blog} contentRef={contentRef} />

        {/* Bài viết liên quan */}
        {relatedBlogs.length > 0 && (
          <div className="mt-10 text-left">
            <h2 className="text-xl text-left font-semibold mb-4 dark:text-white">
              Bài viết liên quan
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {relatedBlogs.map((item) => (
                <li key={item._id}>
                  <Link
                    to={`/blogs/${item._id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bình luận */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Bình luận
          </h2>

          {/* Form nhập bình luận */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              rows={4}
              placeholder="Viết bình luận..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Gửi bình luận
            </button>
          </form>

          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có bình luận nào.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex flex-col items-center w-16">
                    <img
                      src={comment.userId?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover shadow"
                    />
                    <p className="text-xs text-center text-gray-700 dark:text-gray-300 mt-1 font-medium truncate">
                      {comment.userId?.username || "Người dùng"}
                    </p>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 leading-relaxed">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
