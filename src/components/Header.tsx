import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import profileIcon from "../assets/img/profileIcon.png";
import logoText from "../assets/img/LogoTxt.png";

interface styleType {
  $ismobile: boolean;
}

interface userImageType extends styleType {
  $image: string;
}

const HeaderContainer = styled.header<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  /* background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.95)); */
  background-color: black;
  color: white;
  backdrop-filter: blur(8px);
  /* transition: background-color 0.3s ease, border-bottom 0.3s ease; */
  position: fixed;
  top: 0;
  z-index: 3000;
`;

const HeaderMenuContainer = styled.div<styleType>`
  display: flex;
  align-items: center;
  width: 70%;
  height: 100%;
`;

const HeaderMenuBtn = styled.button<styleType>`
  text-align: center;
  background-color: black;
  color: white;
  height: 100%;
  min-width: 5%;
  padding: 10px;
  margin-right: 15px;
  margin-left: ${(props) => (props.$ismobile ? "3px" : null)};
  font-size: ${(props) => (props.$ismobile ? "10px" : "14px")};
  font-weight: 400;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #212529;
  }
`;

const UserInfoContainer = styled.div<styleType>`
  display: flex;
  width: ${(props) => (props.$ismobile ? "30%" : "auto")};
  min-width: 12%;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  margin-right: ${(props) => (props.$ismobile ? "20px" : "40px")};
`;
const Logo = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "80px" : "100px")};
  margin-left: ${(props) => (props.$ismobile ? "20px" : "30px")};
  cursor: pointer;
`;
const UserImageContainer = styled.div<userImageType>`
  width: ${(props) => (props.$ismobile ? "30px" : "35px")};
  height: ${(props) => (props.$ismobile ? "30px" : "35px")};
  border-radius: 10%;
  background-color: grey;
  margin-left: 15px;
  background-image: ${(props) => `url(${props.$image})`};
  background-position: center;
  background-size: cover;
  cursor: pointer;
`;

const HeaderText = styled.span<styleType>`
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  color: white;
`;

const LoginBtn = styled.button<styleType>`
  width: auto;
  height: 30px;
  background-color: transparent;
  padding: 0px 5px;
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  border: none;
  color: white;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

const Popup = styled.div<styleType>`
  width: ${(props) => (props.$ismobile ? "130px" : "150px")};
  height: ${(props) => (props.$ismobile ? "100px" : "120px")};
  border-radius: 14px;
  background-color: black;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: ${(props) => (props.$ismobile ? "10px" : "34px")};
  z-index: 3000;
  top: ${(props) => (props.$ismobile ? "48px" : "50px")};
`;

const PopupBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  width: 80%;
  height: 50px;
  cursor: pointer;
  border: none;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

// const PopupImg = styled.img`
//   width: ${(props) => props.$width};
//   margin-right: ${(props) => props.$mr};
// `;

const Header = () => {
  const [nickname, setNickname] = useState("오윤");
  const [userImg, setUserImg] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });
  const handlePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const onClickMypage = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!isPopupOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        imageRef.current &&
        !imageRef.current.contains(target)
      ) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <>
      <HeaderContainer $ismobile={isMobile}>
        <Logo $ismobile={isMobile} src={logoText} alt="로고 이미지" />
        <HeaderMenuContainer $ismobile={isMobile}>
          {isMobile ? (
            <HeaderMenuBtn $ismobile={isMobile}>메뉴</HeaderMenuBtn>
          ) : (
            <>
              <HeaderMenuBtn $ismobile={isMobile}>홈</HeaderMenuBtn>
              <HeaderMenuBtn $ismobile={isMobile}>커뮤니티</HeaderMenuBtn>
              <HeaderMenuBtn $ismobile={isMobile}>영화</HeaderMenuBtn>
              <HeaderMenuBtn $ismobile={isMobile}>
                내가 찜한 리스트
              </HeaderMenuBtn>
            </>
          )}
        </HeaderMenuContainer>
        <UserInfoContainer $ismobile={isMobile}>
          {nickname === "" ? (
            <LoginBtn $ismobile={isMobile}>
              {isMobile ? "로그인" : "로그인하러 가기"}
            </LoginBtn>
          ) : (
            <>
              <HeaderText $ismobile={isMobile}>{nickname}</HeaderText>
              <UserImageContainer
                ref={imageRef}
                $ismobile={isMobile}
                $image={userImg ? userImg : profileIcon}
                onClick={handlePopup}
              />
            </>
          )}
        </UserInfoContainer>
      </HeaderContainer>
      {isPopupOpen ? (
        <Popup ref={popupRef} $ismobile={isMobile}>
          <PopupBtn onClick={onClickMypage}>마이페이지</PopupBtn>
          <PopupBtn>로그아웃</PopupBtn>
        </Popup>
      ) : null}
    </>
  );
};

export default Header;
