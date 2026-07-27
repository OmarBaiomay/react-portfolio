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

const categories = [
  {
    key: 'frontend',
    items: [
      { name: 'React', icon: '/images/react.svg' },
      { name: 'JavaScript', icon: '/images/javascript.svg' },
      { name: 'TypeScript', Lucide: FileCode2, color: '#3178C6' },
      { name: 'Vite', Lucide: Triangle, color: '#A855F7' },
      { name: 'Tailwind CSS', icon: '/images/tailwindcss.svg' },
      { name: 'CSS3', icon: '/images/css3.svg' },
      { name: 'GSAP', Lucide: Workflow, color: '#88CE02' },
      { name: 'Three.js', Lucide: Boxes, color: '#049EF4' },
    ],
  },
  {
    key: 'backend',
    items: [
      { name: 'Node.js', icon: '/images/nodejs.svg' },
      { name: 'Express', icon: '/images/expressjs.svg' },
      { name: 'PostgreSQL', Lucide: Database, color: '#336791' },
      { name: 'MongoDB', icon: '/images/mongodb.svg' },
      { name: 'Odoo', Lucide: Layers, color: '#714B67' },
      { name: 'Python', Lucide: Code2, color: '#3776AB' },
      { name: 'REST APIs', Lucide: Server, color: '#FF5C1A' },
      { name: 'Docker', Lucide: Container, color: '#2496ED' },
    ],
  },
  {
    key: 'tools',
    items: [
      { name: 'Figma', icon: '/images/figma.svg' },
      { name: 'Git', Lucide: GitBranch, color: '#F05032' },
      { name: 'Cloudflare', Lucide: Cloud, color: '#F38020' },
      { name: 'Linux', Lucide: Server, color: '#FCC624' },
      { name: 'Nginx', Lucide: Wind, color: '#009639' },
      { name: 'CI / CD', Lucide: Workflow, color: '#FF5C1A' },
    ],
  },
];

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

  const Icon = item.Lucide;
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-md"
      style={{ backgroundColor: `${item.color}22`, color: item.color }}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </span>
  );
}

const TechStack = () => {
  const { t } = useLanguage();

  return (
    <section id="tech" className="section bg-elevated/40">
      <div className="container-site">
        <div data-animate="fade-up">
          <p className="kicker">{t.tech.kicker}</p>
          <h2 className="title">{t.tech.title}</h2>
          <p className="lead">{t.tech.lead}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.key}
              className="glass rounded-2xl p-6 md:p-7"
              data-animate="fade-up"
              data-delay={String(index)}
            >
              <h3 className="font-display text-lg font-semibold text-accent md:text-xl">
                {t.tech[category.key]}
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
