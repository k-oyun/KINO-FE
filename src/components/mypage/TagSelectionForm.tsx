// src/components/mypage/TagSelectionForm.tsx

import React, { useState, useEffect } from 'react';
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
  initialSelectedGenres?: string[]; // initialSelectedGenres를 선택적(optional)으로 변경
  onSaveTags: (genres: string[]) => void;
}

const TagSelectionForm: React.FC<TagSelectionFormProps> = ({
  username,
  initialSelectedGenres = [], // ⭐ 여기에 기본값 빈 배열 설정 (undefined 방지)
  onSaveTags,
}) => {
  // useState의 초기값을 props로 받은 initialSelectedGenres로 설정.
  // 이 상태는 사용자가 태그를 클릭하여 변경하는 '현재' 선택된 태그를 나타냅니다.
  const [selectedGenre, setSelectedGenre] = useState<string[]>(initialSelectedGenres);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // initialSelectedGenres prop이 변경될 때마다 selectedGenre 상태를 업데이트
  // 이는 부모 컴포넌트(MyTagsPage)에서 비동기적으로 데이터를 불러와 initialSelectedGenres를 업데이트할 때
  // 자식 컴포넌트의 selectedGenre 상태도 동기화하기 위함입니다.
  useEffect(() => {
    // 배열의 내용을 비교하는 헬퍼 함수
    const areArraysEqual = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) {
        return false;
      }
      // 두 배열을 정렬한 후 문자열로 변환하여 비교 (순서에 상관없이 내용만 비교)
      // 또는 arr1의 모든 요소가 arr2에 포함되어 있고, arr2의 모든 요소가 arr1에 포함되어 있는지 확인
      // 여기서는 순서가 중요하지 않으므로, 더 간단하게 every와 includes를 사용하여 확인
      return arr1.every(val => arr2.includes(val)) && arr2.every(val => arr1.includes(val));
    };

    // 현재 selectedGenre가 initialSelectedGenres와 다를 때만 업데이트
    // 이렇게 함으로써 불필요한 setState 호출로 인한 무한 렌더링을 방지합니다.
    if (!areArraysEqual(selectedGenre, initialSelectedGenres)) {
      setSelectedGenre(initialSelectedGenres);
    }
  }, [initialSelectedGenres, selectedGenre]); // selectedGenre도 의존성 배열에 추가하여 정확한 비교 보장

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

  // 버튼 활성화 로직:
  // 1. 최소 1개 이상의 태그가 선택되어 있어야 함
  // 2. 현재 선택된 태그 목록이 초기 선택된 태그 목록과 달라야 함 (변경된 내용이 있어야 "확인" 버튼 활성화)
  const isButtonActivated =
    selectedGenre.length >= 1 &&
    (selectedGenre.length !== initialSelectedGenres.length ||
     !selectedGenre.every(genre => initialSelectedGenres.includes(genre)) ||
     !initialSelectedGenres.every(genre => selectedGenre.includes(genre))); // 양방향 비교 추가

  const handleSubmit = () => {
    // 부모 컴포넌트(MyTagsPage)로 선택된 태그 목록을 전달하여 API 호출 등을 수행
    onSaveTags(selectedGenre);
  };

  return (
    <TagFormContent>
      <InfoText>
        고객님의 취향에 맞는 영화를 <PinkText>다시</PinkText> 추천해드릴 수 있도록
        <br />
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