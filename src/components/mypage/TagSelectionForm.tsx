import React, { useState } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const TagFormContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.span`
  font-size: 0.9em;
  color: white;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 1.5;
  
  @media (max-width: 767px) {
    font-size: 0.8em;
  }
`;

const PinkText = styled.span`
  color: #FE5890;
  font-weight: bold;
`;

const GenreBtn = styled.button<{ $selected: boolean; $ismobile: boolean }>`
  width: ${(props) => (props.$ismobile ? "60px" : "70px")};
  height: 35px;
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: auto;
  gap: 8px;
  margin-top: 15px;
`;

const ConfirmBtn = styled.button<{ $isActivated: boolean; $ismobile: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$ismobile ? "80px" : "100px")};
  height: 30px;
  margin-top: 30px;
  background-color: ${(props) => (props.$isActivated ? "#fa5a8e" : "#5f5d5d")};
  color: ${(props) => (props.$isActivated ? "black" : "white")};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$isActivated ? "#e04a78" : "#5f5d5d")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface TagSelectionFormProps {
  username: string;
}

const TagSelectionForm: React.FC<TagSelectionFormProps> = ({ username }) => {
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const genreGroups = [
    ["코미디", "로맨스", "스릴러"],
    ["공포", "재난", "범죄", "좀비", "역사"],
    ["애니", "다큐", "액션", "판타지", "드라마"],
    ["SF", "느와르", "뮤지컬", "가족", "전쟁"],
  ];

  const handleGenreClick = (genre: string) => {
    setSelectedGenre((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const isButtonActivated = selectedGenre.length >= 1;

  const handleSubmit = () => {
    console.log("선택된 태그:", selectedGenre);
    // 여기에 선택된 태그 저장 로직 추가 (API 호출 등)
    console.log(`${username}님의 선택된 태그:`, selectedGenre); // username 활용 예시
  };

  return (
    <TagFormContent>
      <InfoText>
        고객님의 취향에 맞는 영화를 <PinkText>다시</PinkText> 추천해드릴 수 있도록<br/>
        선호하는 태그를 선택해주세요.
      </InfoText>
      
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
        $isActivated={isButtonActivated}
        $ismobile={isMobile}
        disabled={!isButtonActivated}
        onClick={handleSubmit}
      >
        확인
      </ConfirmBtn>
    </TagFormContent>
  );
};

export default TagSelectionForm;