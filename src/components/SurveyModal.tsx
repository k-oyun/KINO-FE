import { useEffect, useState } from "react";
import styled from "styled-components";

interface userStateProps {
  setIsNewUser: (value: boolean) => void;
}
const ModalContainer = styled.div`
  width: 50%;
  height: 75%;
  top: 50%;
  left: 50%;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  position: absolute;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-color: rgba(0, 0, 0, 0.9);
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

const MainText = styled.span`
  font-size: 1.9rem;
  font-weight: 600;
  color: white;
  font-family: sans-serif;
`;

const SubText = styled.span`
  font-size: 0.8rem;
  font-family: sans-serif;
  color: white;
`;

const GenreBtn = styled.button<{ $selected: boolean }>`
  width: 70px;
  height: 35px;
  text-align: center;
  font-size: 0.8rem;
  background-color: ${({ $selected }) => ($selected ? "#FE5890" : "#d9d9d9")};
  border: none;
  border-radius: 14px;
  color: black;
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

const SurveyModal = ({ setIsNewUser }: userStateProps) => {
  const [username, setUsername] = useState("권오윤");
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
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
    console.log(selectedGenre);
  }, [selectedGenre]);
  return (
    <ModalContainer>
      <Modal>
        <MainText>안녕하세요. {username}님 </MainText>
        <MainText style={{ marginTop: "10px" }}>
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
                $selected={selectedGenre.includes(genre)}
                onClick={() => handleGenreClick(genre)}
              >
                # {genre}
              </GenreBtn>
            ))}
          </GenreContainer>
        ))}

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
