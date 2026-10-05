import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import ProjectCard from './ProjectCard';

/** Home page shows the first four projects; the rest live on /work. */
const HOME_LIMIT = 4;

const Work = () => {
  const { t } = useLanguage();
  const { projects } = useContent();

  return (
    <section id="portfolio" className="section">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-animate="fade-up">
          <div>
            <p className="kicker">{t.work.kicker}</p>
            <h2 className="title">{t.work.title}</h2>
            <p className="lead">{t.work.lead}</p>
          </div>
          <Link to="/work" className="btn-ghost shrink-0">
            {t.work.viewAll}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2" data-animate="stagger">
          {projects.slice(0, HOME_LIMIT).map((project) => (
            <ProjectCard key={project.slug} project={project} data-animate-child />
          ))}
        </div>

        {projects.length > HOME_LIMIT ? (
          <div className="mt-10 text-center">
            <Link to="/work" className="btn-primary">
              {t.work.viewAllCount.replace('{n}', projects.length)}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Work;
