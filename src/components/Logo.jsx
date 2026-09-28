import logoImg from "../assets/fanhublogo.png";

export const Logo = ({ size = "navbar", className = "", alt = "FandomVerse Logo" }) => {
  let heightClass = "h-10";

  if (size === "footer") {
    heightClass = "h-8";
  } else if (size === "login" || size === "auth") {
    heightClass = "h-45";
  } else if (size === "navbar") {
    heightClass = "h-7";
  }

  return (
    <img
      src={logoImg}
      alt={alt}
      className={`w-auto object-contain shrink-0 ${heightClass} ${className}`}
    />
  );
};

export default Logo;
