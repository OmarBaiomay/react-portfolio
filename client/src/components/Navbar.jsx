import PropTypes from 'prop-types';

const navItems = [
  { label: 'Services', link: '#services' },
  { label: 'Work', link: '#work' },
  { label: 'Pricing', link: '#pricing' },
  { label: 'About', link: '#about' },
  { label: 'Contact', link: '#contact', className: 'md:hidden' },
];

function Navbar({ navOpen, onNavigate }) {
  return (
    <nav className={'navbar ' + (navOpen ? 'active' : '')} aria-label="Primary">
      {navItems.map(({ label, link, className = '' }) => (
        <a
          key={link}
          href={link}
          className={`nav-link ${className}`.trim()}
          onClick={onNavigate}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func,
};

export default Navbar;
