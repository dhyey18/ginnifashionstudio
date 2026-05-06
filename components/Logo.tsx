interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <button className="g-logo" onClick={onClick} aria-label="Ginni's Fashion Studio — go home">
      <div className="g-logo-script">
        Ginni&apos;<span>s</span>
      </div>
      <div className="g-logo-sub">Fashion Studio</div>
    </button>
  );
}
