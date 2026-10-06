import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import BlogCard from '../components/BlogCard';
import Seo from '../seo/Seo';

export default function BlogPage() {
  const { t, lang } = useLanguage();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let alive = true;
    publicAPI
      .getBlogPosts()
      .then(({ data }) => alive && setPosts(Array.isArray(data) ? data : []))
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo title={t.blog.title} description={t.blog.lead} path="/blog" lang={lang} />
      <section className="container-site pb-20 pt-8 md:pb-28">
        <p className="kicker">{t.blog.kicker}</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-6xl">{t.blog.title}</h1>
        <p className="lead">{t.blog.lead}</p>

        {posts === null ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 rounded-2xl border border-line/10 bg-elevated/60" />
            ))}
          </div>
        ) : posts.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-line/15 p-10 text-center text-muted">
            {t.blog.empty}
          </p>
        )}
      </section>
    </main>
  );
}
