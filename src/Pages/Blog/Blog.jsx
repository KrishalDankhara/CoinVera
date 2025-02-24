import React, { useEffect, useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
          const response = await fetch(`https://api.allorigins.win/raw?url=https://cryptopanic.com/api/v1/posts/?auth_token=bedd95a4b2a5197695b57155a63c617c814dd0e8&public=true`); // allorigins.win is a public CORS proxy server by using it we can direct fetches data from cryptopanic site without using nodemon 
          const data = await response.json();
  
          console.log("Fetched data:", data);
  
          if (data && data.results) {
              setNews(data.results);
          } else {
              setNews([]);
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
        <div className="spinner">
          <div className="spin"></div>
        </div>
      ) : (
        <div className="news-list">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                <h2>{article.title}</h2>
                <p>{article.domain}</p>
                <a 
                  href={`https://${article.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
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
