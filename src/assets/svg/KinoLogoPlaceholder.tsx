import Logo from "../img/LogoTxt.png";

export const KinoLogoPlaceholderSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 180 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="180" height="110" rx="16" fill="#22222a" />
    <rect
      x="14"
      y="14"
      width="152"
      height="82"
      rx="12"
      fill="#19191b"
      stroke="#f06292"
      strokeWidth="3"
    />

    <image href={Logo} x="40" y="5" width="100" height="100" />

    <rect x="30" y="34" width="8" height="42" rx="2" fill="#39394a" />
    <rect x="142" y="34" width="8" height="42" rx="2" fill="#39394a" />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={37}
        y={38 + i * 7}
        width="4"
        height="4"
        rx="1"
        fill="#f06292"
        opacity="0.38"
      />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={139}
        y={38 + i * 7}
        width="4"
        height="4"
        rx="1"
        fill="#f06292"
        opacity="0.38"
      />
    ))}
    <text
      x="50%"
      y="92"
      textAnchor="middle"
      fontFamily="sans-serif"
      fontSize="13"
      fontWeight="600"
      fill="#fff"
      opacity="0.32"
    >
      MOVIE
    </text>
  </svg>
);
