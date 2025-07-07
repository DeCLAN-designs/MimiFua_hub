import React from "react";
import "./Blogs.css";

const blogs = [
  {
    id: 1,
    title: "The Future of Laundry Services in Urban Areas",
    excerpt:
      "How modern laundromats are revolutionizing urban living with multi-service hubs...",
    date: "May 15, 2023",
    readTime: "4 min read",
    category: "Industry Trends",
    image:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "5 Ways to Make Your Laundry Business More Sustainable",
    excerpt:
      "Practical tips for reducing water and energy consumption while maintaining quality service...",
    date: "April 28, 2023",
    readTime: "6 min read",
    category: "Sustainability",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Customer Experience Innovations in Service Businesses",
    excerpt:
      "How combining services like laundry with cafés creates better customer experiences...",
    date: "March 10, 2023",
    readTime: "5 min read",
    category: "Customer Service",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
];

const Blogs = () => {
  return (
    <section className="blogs-page">
      <div className="blogs-header">
        <h1 className="blogs-title">Our Blog</h1>
        <p className="blogs-subtitle">
          Insights, trends, and stories from the world of multi-service business
          hubs
        </p>
      </div>

      <div className="blogs-grid">
        {blogs.map((blog) => (
          <article key={blog.id} className="blog-card">
            <div className="blog-image-container">
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <span className="blog-category">{blog.category}</span>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span className="blog-date">{blog.date}</span>
                <span className="blog-read-time">{blog.readTime}</span>
              </div>
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">{blog.excerpt}</p>
              <button className="blog-read-more">Read More</button>
            </div>
          </article>
        ))}
      </div>

      <div className="newsletter-section">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for the latest blog posts and updates</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Blogs;
