import Logo from "../img/LogoTxt.png";

export const KinoPosterPlaceholderSVG = () => (
  <svg
    width="140"
    height="200"
    viewBox="0 0 140 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="140" height="200" rx="14" fill="#22222a" />
    <rect
      x="10"
      y="16"
      width="120"
      height="168"
      rx="10"
      fill="#19191b"
      stroke="#f06292"
      strokeWidth="2.5"
    />
    {/* 중앙에 KINO 텍스트 대신 이미지 */}
    <image
      href={Logo}
      x="35" // X좌표 (가운데 오도록 조정)
      y="65" // Y좌표 (위아래 위치)
      width="70" // 너비 (이미지 크기에 따라 조정)
      height="70" // 높이 (이미지 비율에 따라 맞추거나, 생략 시 자동)
      style={{ opacity: 0.95 }} // 원하면 투명도 등 스타일도 줄 수 있음
      preserveAspectRatio="xMidYMid meet"
    />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect
        key={i}
        x={15}
        y={26 + i * 20}
        width="5"
        height="7"
        rx="2"
        fill="#f06292"
        opacity="0.17"
      />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <rect
        key={i}
        x={120}
        y={26 + i * 20}
        width="5"
        height="7"
        rx="2"
        fill="#f06292"
        opacity="0.17"
      />
    ))}
  </svg>
);
