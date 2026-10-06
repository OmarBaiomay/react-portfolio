import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import BlogCard from './BlogCard';

/** Home page "latest articles". Renders nothing until there is a published post. */
export default function BlogTeaser() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let alive = true;
    publicAPI
      .getBlogPosts({ limit: 3 })
      .then(({ data }) => alive && setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <section id="blog" className="section">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker">{t.blog.kicker}</p>
            <h2 className="title">{t.blog.latest}</h2>
          </div>
          <Link to="/blog" className="btn-ghost shrink-0">
            {t.blog.viewAll}
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
