import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import useMypageApi from "../../api/mypage";

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
    color: #fe5890;
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
    background-color: ${(props) =>
        props.$isActivated ? "#fa5a8e" : "#5f5d5d"};
    color: ${(props) => (props.$isActivated ? "black" : "white")};
    border: none;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.$isActivated ? "#e04a78" : "#5f5d5d"};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

interface TagSelectionFormProps {
    username: string;
}

// const TagSelectionForm: React.FC<TagSelectionFormProps> = ({ username }) => {
const TagSelectionForm: React.FC<TagSelectionFormProps> = () => {
    const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const { getGenre, updateGenre } = useMypageApi();

    useEffect(() => {
        const fetchGenre = async () => {
            const res = await getGenre();
            const genres = res.data.data.userGenres || [];
            const genreNames = genres.map(
                (item: { genreName: string }) => item.genreName
            );
            setSelectedGenre(genreNames);
        };
        fetchGenre();
    }, []);

    const genreGroups = [
        ["코미디", "로맨스", "스릴러"],
        ["공포", "재난", "범죄", "서부", "역사"],
        ["애니", "다큐", "액션", "판타지", "드라마"],
        ["SF", "모험", "음악", "가족", "전쟁"],
    ];

    const genreNameToIdMap: { [key: string]: number } = {
        코미디: 35,
        로맨스: 10749, // 10,749 → 콤마 제거 후 숫자로
        스릴러: 53,
        공포: 27,
        재난: 28,
        범죄: 80,
        서부: 37,
        역사: 36,
        애니: 16,
        다큐: 99,
        액션: 28,
        판타지: 14,
        드라마: 18,
        SF: 878,
        모험: 12,
        음악: 10402, // 이미지에 없어서 임의 0 처리 (확인 필요)
        가족: 10751,
        전쟁: 10752,
    };

    const handleGenreClick = (genre: string) => {
        setSelectedGenre((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    const isButtonActivated = selectedGenre.length >= 1;

    const handleSubmit = async () => {
        // console.log("선택된 태그:", selectedGenre);
        // // 여기에 선택된 태그 저장 로직 추가 (API 호출 등)
        // console.log(`${username}님의 선택된 태그:`, selectedGenre); // username 활용 예시

        // selectedGenre (이름 배열) → genreIds (숫자 배열) 변환
        const genreIds = selectedGenre
            .map((name) => genreNameToIdMap[name])
            .filter((id) => id !== undefined);

        if (genreIds.length === 0) {
            alert("하나 이상의 장르를 선택해주세요.");
            return;
        }

        try {
            const res = await updateGenre(genreIds);
            console.log("장르 업데이트 성공:", res.data);
            alert("장르가 성공적으로 업데이트 되었습니다.");
        } catch (error) {
            console.error("장르 업데이트 실패:", error);
            alert("장르 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <TagFormContent>
            <InfoText>
                고객님의 취향에 맞는 영화를 <PinkText>다시</PinkText> 추천해드릴
                수 있도록
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
