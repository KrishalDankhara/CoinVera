import React, { useEffect, useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:5000/news"); // this request comes from server.js file where  Crypto News API Key is taken from CryptoPanic website and use it in server.js
            const data = await response.json();

            console.log("Fetched data:", data); // Debugging

            if (data && data.results) {
                setNews(data.results);
            } else {
                setNews([]); // No valid news data
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching news:", error);
            setLoading(false);
        }
    };

    fetchNews();
}, []);


  return (
    <div className="blog-container">
      <h1>Crypto Market News</h1>
      {loading ? (
        <div className='spinner'>
            <div className="spin"></div>
        </div>
      ) : (
        <div className="news-list">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                <h2>{article.title}</h2>
                <p>{article.domain}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
