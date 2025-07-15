import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

interface userStateProps {
  setIsNewUser: (value: boolean) => void;
}

interface styleProps {
  $ismobile: boolean;
}
const ModalContainer = styled.div<styleProps>`
  width: ${(props) => (props.$ismobile ? "90%" : "50%")};
  height: ${(props) => (props.$ismobile ? "85%" : "75%")};
  top: 50%;
  left: 50%;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  position: fixed;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3100;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
`;

const SkipBtn = styled.button`
  font-size: 13px;
  color: white;
  position: absolute;
  background-color: transparent;
  border: none;
  height: 40px;
  bottom: 30px;
  right: 50px;
  cursor: pointer;
`;

const MainText = styled.span<styleProps>`
  font-size: ${(props) => (props.$ismobile ? "1.5rem" : "1.9rem")};
  font-weight: 600;
  color: white;
  /* font-family: sans-serif; */
`;

const SubText = styled.span`
  font-size: 0.8rem;
  /* font-family: sans-serif; */
  color: white;
`;

const GenreBtn = styled.button<{ $selected: boolean; $ismobile: boolean }>`
  width: ${(props) => (props.$ismobile ? "60px" : "70px")};
  height: ${(props) => (props.$ismobile ? "35px" : "35px")};
  text-align: center;
  font-size: 0.8rem;
  background-color: ${({ $selected }) => ($selected ? "#FE5890" : "#d9d9d9")};
  border: none;
  border-radius: 14px;
  color: black;
  transition: background-color 0.2s ease;
  cursor: pointer;
  &:hover {
    background-color: pink;
  }
`;
const GenreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  gap: 8px;
  margin-top: 15px;
  height: 35px;
`;

const ConfirmBtn = styled.button<{ $isbtnpos: boolean; $ismobile: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$ismobile ? "80px" : "100px")};
  height: 30px;
  margin-top: 30px;
  background-color: ${(props) => (props.$isbtnpos ? "#fa5a8e" : "#5f5d5d")};
  color: ${(props) => (props.$isbtnpos ? "black" : "white")};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$isbtnpos ? "#e04a78" : "#5f5d5d")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SurveyModal = ({ setIsNewUser }: userStateProps) => {
  const [username, setUsername] = useState("권오윤");
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [isBtnPos, setIsBtnPos] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const genreGroups = [
    ["코미디", "로맨스", "스릴러"],
    ["공포", "재난", "범죄", "좀비", "역사"],
    ["애니", "다큐", "액션", "판타지", "드라마"],
  ];

  const handleGenreClick = (genre: string) => {
    setSelectedGenre((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  useEffect(() => {
    if (selectedGenre.length >= 1) {
      setIsBtnPos(true);
    } else {
      setIsBtnPos(false);
    }
  }, [selectedGenre]);

  return (
    <ModalContainer $ismobile={isMobile}>
      <Modal>
        <MainText $ismobile={isMobile}>안녕하세요. {username}님 </MainText>
        <MainText $ismobile={isMobile} style={{ marginTop: "10px" }}>
          KINO에 오신 것을 환영합니다!
        </MainText>
        <SubText style={{ marginTop: "50px" }}>
          저희가 고객님의 취향에 맞는 영화를 추천해드릴 수 있게
        </SubText>
        <SubText style={{ marginTop: "10px" }}>
          좋아하시는 영화 장르를 선택해주세요
        </SubText>
        <GenreBtn
          style={{ marginTop: "50px" }}
          $ismobile={isMobile}
          $selected={selectedGenre.includes("SF")}
          onClick={() => handleGenreClick("SF")}
        >
          # SF
        </GenreBtn>
        {genreGroups.map((group, idx) => (
          <GenreContainer key={idx}>
            {group.map((genre) => (
              <GenreBtn
                key={genre}
                $ismobile={isMobile}
                $selected={selectedGenre.includes(genre)}
                onClick={() => handleGenreClick(genre)}
              >
                # {genre}
              </GenreBtn>
            ))}
          </GenreContainer>
        ))}
        <ConfirmBtn
          $isbtnpos={isBtnPos}
          $ismobile={isMobile}
          disabled={!isBtnPos}
          onClick={() => {
            console.log("clicked");
          }}
        >
          확인
        </ConfirmBtn>
        <SkipBtn
          onClick={() => {
            setIsNewUser(false);
          }}
        >
          건너뛰기
        </SkipBtn>
      </Modal>
    </ModalContainer>
  );
};

export default SurveyModal;
