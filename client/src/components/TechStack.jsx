import {
  Boxes,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Server,
  Triangle,
  Wind,
  Workflow,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

/** lucide icons the dashboard can pick by name. */
const LUCIDE = {
  Boxes,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Server,
  Triangle,
  Wind,
  Workflow,
};

function ToolIcon({ item }) {
  if (item.icon) {
    return (
      <img
        src={item.icon}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
        loading="lazy"
      />
    );
  }

  const Icon = LUCIDE[item.lucide] || Code2;
  const color = item.color || 'rgb(var(--c-accent))';
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-md"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </span>
  );
}

const TechStack = () => {
  const { t, lang } = useLanguage();
  const { techStack } = useContent();

  return (
    <section id="tech" className="section bg-elevated/40">
      <div className="container-site">
        <div data-animate="fade-up">
          <p className="kicker">{t.tech.kicker}</p>
          <h2 className="title">{t.tech.title}</h2>
          <p className="lead">{t.tech.lead}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {techStack.map((category, index) => (
            <div
              key={category.key}
              className="glass rounded-2xl p-6 md:p-7"
              data-animate="fade-up"
              data-delay={String(index)}
            >
              <h3 className="font-display text-lg font-semibold text-accent md:text-xl">
                {category.title?.[lang] || t.tech[category.key] || category.key}
              </h3>
              <ul className="mt-5 grid grid-cols-2 gap-2.5" data-animate="stagger">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    data-animate-child
                    className="group flex items-center gap-2.5 rounded-xl border border-line/10 bg-bg/40 px-3 py-2.5 transition hover:border-accent/40 hover:bg-accent/5"
                  >
                    <ToolIcon item={item} />
                    <span className="text-xs font-semibold text-ink sm:text-sm">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
