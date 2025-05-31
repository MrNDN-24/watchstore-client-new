import React from "react";

const BlogContent = ({ blog, contentRef }) => {
  const cleanContent = blog.content.replace(
    /<(\w+)([^>]*)style="([^"]*)"([^>]*)>/gi,
    (match, tag, beforeStyle, styleContent, afterStyle) => {
      const cleanedStyle = styleContent
        .split(";")
        .map((rule) => rule.trim())
        .filter((rule) => {
          const lower = rule.toLowerCase();
          return (
            !lower.startsWith("color") &&
            !lower.startsWith("background") &&
            !lower.startsWith("text-align")
          );
        })
        .join("; ");

      if (cleanedStyle) {
        return `<${tag}${beforeStyle}style="${cleanedStyle}"${afterStyle}>`;
      } else {
        return `<${tag}${beforeStyle}${afterStyle}>`;
      }
    }
  );

  return (
    <div>
      <style>{`
  .blog-content h1,
  .blog-content h2,
  .blog-content h3,
  .blog-content h4,
  .blog-content h5,
  .blog-content h6 {
    text-align: center;
    color: #111827; /* dark text */
  }
  
  .dark .blog-content h1,
  .dark .blog-content h2,
  .dark .blog-content h3,
  .dark .blog-content h4,
  .dark .blog-content h5,
  .dark .blog-content h6 {
    color: #e0e7ff; /* màu sáng cho dark mode */
  }

  /* Các thẻ khác căn lề 2 bên */
  .blog-content p,
  .blog-content li,
  .blog-content blockquote,
  .blog-content table,
  .blog-content td,
  .blog-content th {
    text-align: justify;
    color: #374151; /* màu chữ bình thường */
  }
  
  .dark .blog-content p,
  .dark .blog-content li,
  .dark .blog-content blockquote,
  .dark .blog-content table,
  .dark .blog-content td,
  .dark .blog-content th {
    color: #d1d5db; /* màu chữ sáng hơn cho dark mode */
  }

    .blog-content h1 {
    font-size: 2.25rem; /* text-4xl */
    font-weight: 800;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    text-align: center; /* căn giữa */
  }

  .blog-content table {
  border-collapse: collapse; /* gộp các đường viền */
  width: 100%; /* bảng rộng 100% */
  border: 1px solid #374151; /* viền bảng màu xám đậm */
}

.blog-content th,
.blog-content td {
  border: 1px solid #374151; /* viền từng ô */
  padding: 8px; /* padding cho dễ đọc */
}

.dark .blog-content table,
.dark .blog-content th,
.dark .blog-content td {
  border-color: #d1d5db; /* viền sáng hơn cho dark mode */
}


`}</style>

      <div
        ref={contentRef}
        className="blog-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </div>
  );
};

export default BlogContent;
