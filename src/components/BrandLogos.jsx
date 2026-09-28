const FanaticalLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#ff5400" />
    <path
  d="M12 4C12 4 14 7 14 9C14 10.1 13.1 11 12 11C10.9 11 10 10.1 10 9C10 7.8 10.8 6.2 12 4ZM15.5 10C16.9 11.4 17.5 13.5 17 15.5C16.2 18.5 13.5 20 10.5 19.8C7.5 19.5 5 17.2 4.5 14.2C4.2 12.2 4.9 10.2 6.2 8.8C6 10.2 6.5 11.8 7.6 12.8C8.2 13.4 9 13.8 9.8 13.8C10.8 13.8 11.6 13.2 12 12.5C12.5 13.8 13.8 14.8 15.2 14.5C16.2 14.2 16.8 13.2 16.8 12.2C16.8 11.2 16.2 10.4 15.5 10Z"
  fill="#ffffff"
/>
  </svg>;
const MetacriticLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#222222" />
    <circle cx="12" cy="12" r="10" fill="#ffcc33" />
    <path
  d="M8 15.5V9.5L10.5 13L13 9.5V15.5H11.5V12.2L10.5 13.6L9.5 12.2V15.5H8Z"
  fill="#111111"
/>
    <circle cx="15.5" cy="14" r="1.5" fill="#111111" />
  </svg>;
const GameSpotLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#ff002e" />
    <path
  d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C15 18 17.5 15.8 17.9 13H12V11H19.9C20 11.3 20 11.7 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C14.2 4 16.2 4.9 17.7 6.3L16.3 7.7C15.2 6.6 13.7 6 12 6Z"
  fill="#ffffff"
/>
  </svg>;
const TVGuideLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <rect width="24" height="24" rx="4" fill="#e51c24" />
    <text
  x="12"
  y="11"
  fontFamily="system-ui, sans-serif"
  fontSize="9"
  fontWeight="900"
  fill="#ffffff"
  textAnchor="middle"
  letterSpacing="-0.5"
>
      TV
    </text>
    <text
  x="12"
  y="18"
  fontFamily="system-ui, sans-serif"
  fontSize="5"
  fontWeight="800"
  fill="#ffffff"
  textAnchor="middle"
  letterSpacing="0.2"
>
      GUIDE
    </text>
  </svg>;
const GameFAQsLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#0066cc" />
    <text
  x="12"
  y="15.5"
  fontFamily="system-ui, sans-serif"
  fontSize="10"
  fontWeight="900"
  fill="#ffffff"
  textAnchor="middle"
  letterSpacing="-0.5"
>
      GF
    </text>
  </svg>;
const ComicVineLogo = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#00a859" />
    <text
  x="12"
  y="15.5"
  fontFamily="system-ui, sans-serif"
  fontSize="10"
  fontWeight="900"
  fill="#ffffff"
  textAnchor="middle"
  letterSpacing="-0.5"
>
      CV
    </text>
  </svg>;
export {
  ComicVineLogo,
  FanaticalLogo,
  GameFAQsLogo,
  GameSpotLogo,
  MetacriticLogo,
  TVGuideLogo
};
