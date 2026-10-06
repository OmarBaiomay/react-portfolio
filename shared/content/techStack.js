/**
 * Tech stack groups. `icon` is an image URL; otherwise `lucide` names a lucide-react
 * icon drawn in `color`. Group titles come from translations: tech.<key>.
 */
export const techStack = [
  {
    key: 'frontend',
    items: [
      { name: 'React', icon: '/images/react.svg' },
      { name: 'JavaScript', icon: '/images/javascript.svg' },
      { name: 'TypeScript', lucide: 'FileCode2', color: '#3178C6' },
      { name: 'Vite', lucide: 'Triangle', color: '#A855F7' },
      { name: 'Tailwind CSS', icon: '/images/tailwindcss.svg' },
      { name: 'CSS3', icon: '/images/css3.svg' },
      { name: 'GSAP', lucide: 'Workflow', color: '#88CE02' },
    ],
  },
  {
    key: 'backend',
    items: [
      { name: 'Node.js', icon: '/images/nodejs.svg' },
      { name: 'Express', icon: '/images/expressjs.svg' },
      { name: 'PostgreSQL', lucide: 'Database', color: '#336791' },
      { name: 'MongoDB', icon: '/images/mongodb.svg' },
      { name: 'Odoo', lucide: 'Layers', color: '#714B67' },
      { name: 'Python', lucide: 'Code2', color: '#3776AB' },
      { name: 'REST APIs', lucide: 'Server', color: '#3B82F6' },
      { name: 'Docker', lucide: 'Container', color: '#2496ED' },
    ],
  },
  {
    key: 'tools',
    items: [
      { name: 'Figma', icon: '/images/figma.svg' },
      { name: 'Git', lucide: 'GitBranch', color: '#F05032' },
      { name: 'Cloudflare', lucide: 'Cloud', color: '#F38020' },
      { name: 'Linux', lucide: 'Server', color: '#FCC624' },
      { name: 'Nginx', lucide: 'Wind', color: '#009639' },
      { name: 'CI / CD', lucide: 'Workflow', color: '#3B82F6' },
    ],
  },
];
