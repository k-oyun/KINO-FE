import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import profileIcon from "../assets/img/profileIcon.png";
import logoText from "../assets/img/LogoTxt.png";
import { SearchBar } from "./SearchBar";

interface styleType {
  $ismobile: boolean;
}

interface userImageType extends styleType {
  $image: string;
}
interface SearchBarProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const HeaderContainer = styled.header<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  backdrop-filter: blur(8px);
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
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  position: relative;
  height: 100%;
  min-width: 8%;
  padding: 10px;
  margin-right: 15px;
  margin-left: ${(props) => (props.$ismobile ? "3px" : null)};
  font-size: ${(props) => (props.$ismobile ? "10px" : "14px")};
  font-weight: 400;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.hoverColor};
  }
`;

const UserInfoContainer = styled.div<styleType>`
  display: flex;
  width: 30%;
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
  color: ${({ theme }) => theme.textColor};
`;

const LoginBtn = styled.button<styleType>`
  width: auto;
  height: 30px;
  background-color: transparent;
  padding: 0px 5px;
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  border: none;
  color: ${({ theme }) => theme.textColor};
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
  background-color: ${({ theme }) => theme.backgroundColor};
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
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  width: 80%;
  height: 50px;
  cursor: pointer;
  border: none;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

const MenuPopup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 60px;
  left: 0px;
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const MenuPopupText = styled.span<{ $ismenupopupopen: boolean }>`
  font-size: 7px;
  text-align: center;
  margin-left: 4px;
  display: inline-block;
  transform: rotate(${(props) => (props.$ismenupopupopen ? "180deg" : "0deg")});
  transition: transform 0.4s ease;
  font-family: sans-serif;
`;

const MainHeader = ({ keyword, setKeyword }: SearchBarProps) => {
  const [nickname, setNickname] = useState("오윤");
  const [userImg, setUserImg] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const menuPopupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const menuItems = [
    { label: "홈", path: "/" },
    { label: "커뮤니티", path: "/comnmuniy" },
    { label: "영화", path: "/movies" },
    { label: "내가 찜한 리스트", path: "/wish" },
  ];

  const handlePopup = () => {
    setIsPopupOpen((prev) => !prev);
    setIsMenuPopupOpen(false);
  };

  const handleMenuPopup = () => {
    setIsMenuPopupOpen((prev) => !prev);
    setIsPopupOpen(false);
  };

  const onClickMypage = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!isPopupOpen && !isMenuPopupOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isPopupOpen &&
        popupRef.current &&
        !popupRef.current.contains(target) &&
        imageRef.current &&
        !imageRef.current.contains(target)
      ) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen, isMenuPopupOpen]);

  return (
    <>
      <HeaderContainer $ismobile={isMobile}>
        <Logo $ismobile={isMobile} src={logoText} alt="로고 이미지" />
        <HeaderMenuContainer $ismobile={isMobile}>
          {isMobile ? (
            <>
              <HeaderMenuBtn $ismobile={isMobile} onClick={handleMenuPopup}>
                메뉴
                <MenuPopupText $ismenupopupopen={isMenuPopupOpen}>
                  ▼
                </MenuPopupText>
              </HeaderMenuBtn>
              {isMenuPopupOpen && (
                <MenuPopup ref={menuPopupRef}>
                  {menuItems.map(({ label, path }) => (
                    <HeaderMenuBtn
                      key={path}
                      $ismobile={isMobile}
                      style={{ width: "100%" }}
                      onClick={handleMenuPopup}
                    >
                      {label}
                    </HeaderMenuBtn>
                  ))}
                </MenuPopup>
              )}
            </>
          ) : (
            <>
              {menuItems.map(({ label, path }) => (
                <HeaderMenuBtn key={path} $ismobile={isMobile}>
                  {label}
                </HeaderMenuBtn>
              ))}
            </>
          )}
        </HeaderMenuContainer>

        <UserInfoContainer $ismobile={isMobile}>
          {!isMobile && <SearchBar keyword={keyword} setKeyword={setKeyword} />}

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
      {isPopupOpen && (
        <Popup $ismobile={isMobile} ref={popupRef}>
          <PopupBtn onClick={onClickMypage}>마이페이지</PopupBtn>
          <PopupBtn>로그아웃</PopupBtn>
        </Popup>
      )}
    </>
  );
};

export default MainHeader;
