import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Seo from '../seo/Seo';

export default function NotFoundPage() {
  const { lang, t } = useLanguage();
  const copy = t.notFound;

  return (
    <main className="container-site flex min-h-[70svh] flex-col items-start justify-center py-28">
      <Seo
        title={copy.title}
        description={copy.lead}
        path="/404"
        lang={lang}
        noindex
      />
      <p className="kicker">404</p>
      <h1 className="title max-w-xl">{copy.title}</h1>
      <p className="lead">{copy.lead}</p>
      <Link to="/" className="btn-primary mt-8">
        {copy.home}
      </Link>
    </main>
  );
}
