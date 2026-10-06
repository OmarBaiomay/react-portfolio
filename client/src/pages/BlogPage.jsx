import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, History, Search, Sparkles, X, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import BlogCard from '../components/BlogCard';
import BlogMiniCard from '../components/BlogMiniCard';
import Select from '../components/Select';
import { categoryLabel, formatPostDate, normalizeSearch, pickLang, tagLabel } from '../lib/blog';
import Seo from '../seo/Seo';

const SORTS = ['newest', 'oldest', 'quickest'];

/** Text a post is matched against — both languages, so an Arabic or English query finds it either way. */
const searchText = (post) =>
  normalizeSearch(
    [
      post.title?.en,
      post.title?.ar,
      post.excerpt?.en,
      post.excerpt?.ar,
      post.seo?.description?.en,
      post.seo?.description?.ar,
      ...(post.tags || []),
      ...(post.tags || []).map((tag) => tagLabel(tag, 'ar')),
      post.categoryName?.en,
      post.categoryName?.ar,
    ].join(' '),
  );

function FeaturedPost({ post, wide = false, big = false }) {
  const { t, lang } = useLanguage();
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group grid overflow-hidden rounded-3xl border border-line/10 bg-elevated/60 transition hover:border-accent/40 ${
        wide ? (big ? 'lg:grid-cols-[1.45fr_1fr]' : 'lg:grid-cols-[1.2fr_1fr]') : ''
      }`}
    >
      <figure className="relative aspect-[16/9] overflow-hidden bg-surface">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : null}
        {wide && !big ? null : (
          <span className="absolute start-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
            {t.blog.featured}
          </span>
        )}
      </figure>
      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <h2
          className={`font-display font-bold leading-tight text-ink ${big ? 'text-3xl md:text-4xl xl:text-5xl' : 'text-2xl md:text-4xl'}`}
        >
          {pickLang(post.title, lang)}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{pickLang(post.excerpt, lang)}</p>
        {/* Tags on their own line; date, reading time and the link share one row that never wraps the link */}
        <div className="mt-6 border-t border-line/10 pt-5">
          {categoryLabel(post, lang) ? (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {categoryLabel(post, lang)}
              </span>
            </div>
          ) : null}
          <div className="mt-3 flex items-center justify-between gap-4 text-sm text-muted">
            <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, lang)}</time>
              {post.minutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.minutes[lang] || post.minutes.en} {t.blog.minRead}
                </span>
              ) : null}
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-ink transition group-hover:text-accent">
              {t.blog.readMore}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const { t, lang } = useLanguage();
  const b = t.blog;
  const [posts, setPosts] = useState(null);
  const [params, setParams] = useSearchParams();
  const inputRef = useRef(null);
  const chipsRef = useRef(null);
  const chipRefs = useRef(new Map());
  const gridRef = useRef(null);
  const [pill, setPill] = useState(null);
  const [categories, setCategories] = useState([]);

  // Search, topic and sort live in the URL so results can be shared and survive a refresh.
  const query = params.get('q') || '';
  const topic = params.get('category') || '';
  const sort = SORTS.includes(params.get('sort')) ? params.get('sort') : 'newest';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    let alive = true;
    publicAPI
      .getBlogPosts()
      .then(({ data }) => alive && setPosts(Array.isArray(data) ? data : []))
      .catch(() => alive && setPosts([]));
    publicAPI
      .getBlogCategories()
      .then(({ data }) => alive && setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // "/" focuses the search box, like most documentation sites.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Sliding highlight behind the active topic chip.
  useLayoutEffect(() => {
    const place = () => {
      const chip = chipRefs.current.get(topic);
      setPill(chip ? { x: chip.offsetLeft, y: chip.offsetTop, w: chip.offsetWidth, h: chip.offsetHeight } : null);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [topic, posts, lang, categories]);

  // Keep the active chip visible inside the scrollable row (horizontal only — the page itself stays put).
  useEffect(() => {
    const chip = chipRefs.current.get(topic);
    const row = chipsRef.current;
    if (!chip || !row) return;
    const target = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({
      left: getComputedStyle(row).direction === 'rtl' ? target - (row.scrollWidth - row.clientWidth) : target,
      behavior: 'smooth',
    });
  }, [topic]);

  // Cards rise, sharpen and fade in one after another whenever the topic or sort changes.
  const animKey = `${topic}|${sort}`;
  const firstRun = useRef(true);
  useLayoutEffect(() => {
    if (!posts || !gridRef.current) return undefined;
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-swap]',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform' },
      );
      gsap.fromTo(
        '[data-card]',
        { opacity: 0, y: 36, scale: 0.96, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.07,
          clearProps: 'opacity,transform,filter',
        },
      );
    }, gridRef.current.parentElement);
    return () => ctx.revert();
  }, [animKey, posts]);

  const indexed = useMemo(() => (posts || []).map((post) => ({ post, text: searchText(post) })), [posts]);

  // Categories that have at least one published post, in the order set in the dashboard.
  const topics = useMemo(() => {
    const counts = new Map();
    (posts || []).forEach((post) => post.category && counts.set(post.category, (counts.get(post.category) || 0) + 1));
    return categories.filter((c) => counts.has(c.slug)).map((c) => [c.slug, counts.get(c.slug), c.name]);
  }, [posts, categories]);
  const topicName = (slug) => pickLang(categories.find((c) => c.slug === slug)?.name, lang) || slug;

  const results = useMemo(() => {
    const words = normalizeSearch(query).split(' ').filter(Boolean);
    const list = indexed
      .filter(({ post, text }) => (!topic || post.category === topic) && words.every((w) => text.includes(w)))
      .map(({ post }) => post);
    const time = (post) => new Date(post.publishedAt || 0).getTime();
    const minutes = (post) => post.minutes?.[lang] || post.minutes?.en || 0;
    if (sort === 'oldest') return [...list].sort((a, c) => time(a) - time(c));
    if (sort === 'quickest') return [...list].sort((a, c) => minutes(a) - minutes(c) || time(c) - time(a));
    return [...list].sort((a, c) => time(c) - time(a));
  }, [indexed, query, topic, sort, lang]);

  // The featured block stays put while topics and sort change (only a text search hides it), so the
  // toolbar never jumps. The grid shows every match except the featured post.
  const newest = useMemo(
    () => [...(posts || [])].sort((a, c) => new Date(c.publishedAt || 0) - new Date(a.publishedAt || 0)),
    [posts],
  );
  const featured = !query && newest.length > 3 ? newest[0] : null;
  const side = featured
    ? newest
        .slice(1)
        .sort((a, c) => (a.minutes?.[lang] || 0) - (c.minutes?.[lang] || 0))
        .slice(0, 3)
    : [];
  const grid = featured && !topic ? results.filter((post) => post !== featured) : results;
  const countLabel = results.length === 1 ? b.result : b.results.replace('{n}', results.length);

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo title={b.title} description={b.lead} path="/blog" lang={lang} />
      <section className="container-site pb-20 pt-8 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
          <div className="max-w-3xl">
            <p className="kicker">{b.kicker}</p>
            <h1 className="font-display text-4xl font-bold text-ink md:text-6xl">{b.title}</h1>
            <p className="lead">{b.lead}</p>
          </div>

          <label className="relative block">
            <span className="sr-only">{b.searchLabel}</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder={b.searchPlaceholder}
              className="h-14 w-full rounded-2xl border border-line/15 bg-elevated/60 pe-24 ps-12 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent/60 focus:ring-4 focus:ring-accent/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setParam('q', '');
                  inputRef.current?.focus();
                }}
                aria-label={b.clearFilters}
                className="absolute end-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-line/10 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute end-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-line/20 px-2 py-0.5 font-mono text-xs text-muted md:block">
                /
              </kbd>
            )}
          </label>
        </div>

        {posts === null ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl border border-line/10 bg-elevated/60" />
            ))}
          </div>
        ) : !posts.length ? (
          <p className="mt-12 rounded-2xl border border-dashed border-line/15 p-10 text-center text-muted">{b.empty}</p>
        ) : (
          <>
            {/* Big featured article across the full width, quick reads underneath */}
            {featured ? (
              <>
                <div className="mt-12">
                  <FeaturedPost post={featured} wide big />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.1fr]">
                  {side.map((post) => (
                    <BlogMiniCard key={post.id} post={post} />
                  ))}
                  <div className="flex flex-col justify-center rounded-2xl border border-accent/25 bg-accent/10 p-5">
                    <p className="font-display text-base font-bold text-ink">{b.sideCtaTitle}</p>
                    <Link to="/#contact" className="btn-primary group mt-3 w-fit !px-4 !py-2 text-sm">
                      {b.sideCtaButton}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </>
            ) : null}

            {/* Toolbar: heading + count + sort, then one scrollable row of topics */}
            <div className={featured ? 'mt-16' : 'mt-10'}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 data-swap className="font-display text-2xl font-bold text-ink md:text-3xl">
                    {query ? b.searchLabel : topic ? topicName(topic) : b.latestArticles}
                  </h2>
                  <p data-swap className="mt-1 text-sm text-muted" aria-live="polite">
                    {countLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="hidden sm:inline">{b.sortBy}</span>
                  <Select
                    value={sort}
                    ariaLabel={b.sortBy}
                    onChange={(v) => setParam('sort', v === 'newest' ? '' : v)}
                    className="w-44"
                    options={[
                      { value: 'newest', label: b.sortNewest, icon: Sparkles },
                      { value: 'oldest', label: b.sortOldest, icon: History },
                      { value: 'quickest', label: b.sortQuickest, icon: Zap },
                    ]}
                  />
                </div>
              </div>

              {topics.length ? (
                <div
                  ref={chipsRef}
                  className="scroll-hide relative -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 pe-14 [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] sm:mx-0 sm:ps-0 sm:pe-14 rtl:[mask-image:linear-gradient(to_left,black_calc(100%-3rem),transparent)]"
                  role="group"
                  aria-label={b.topics}
                >
                  {pill ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 rounded-full bg-accent shadow-[0_8px_24px_-6px_rgb(var(--c-accent)/0.6)] transition-[transform,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: pill.w, height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)` }}
                    />
                  ) : null}
                  {[['', posts.length], ...topics].map(([tag, count]) => {
                    const on = topic === tag;
                    return (
                      <button
                        key={tag || 'all'}
                        ref={(el) => (el ? chipRefs.current.set(tag, el) : chipRefs.current.delete(tag))}
                        type="button"
                        onClick={() => setParam('category', tag)}
                        aria-pressed={on}
                        className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                          on
                            ? `border-transparent text-white ${pill ? '' : 'bg-accent'}`
                            : 'border-line/15 text-ink hover:border-accent/50'
                        }`}
                      >
                        {tag ? topicName(tag) : b.allTopics}
                        <span className={`text-xs ${on ? 'text-white/80' : 'text-muted'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Fixed minimum height so filtering never shrinks the page under the reader's scroll position */}
            <div ref={gridRef} className="min-h-[34rem]">
              {grid.length === 1 ? (
                <div data-card className="mt-6">
                  <FeaturedPost post={grid[0]} wide />
                </div>
              ) : grid.length ? (
                <div className={`mt-6 grid gap-5 md:grid-cols-2 ${grid.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                  {grid.map((post) => (
                    <div key={post.id} data-card>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div data-card className="mt-6 rounded-2xl border border-dashed border-line/15 p-10 text-center">
                  <p className="text-muted">{b.noResults}</p>
                  <button type="button" className="btn-ghost mt-5" onClick={() => setParams({}, { replace: true })}>
                    <X className="h-4 w-4" />
                    {b.clearFilters}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const postShape = PropTypes.shape({
  slug: PropTypes.string.isRequired,
  title: PropTypes.object,
  excerpt: PropTypes.object,
  coverUrl: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishedAt: PropTypes.string,
  minutes: PropTypes.object,
}).isRequired;
FeaturedPost.propTypes = { post: postShape, wide: PropTypes.bool, big: PropTypes.bool };
