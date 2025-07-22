import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import useMypageApi from "../../api/mypage";
import { useTranslation } from "react-i18next";

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

const TagSelectionForm: React.FC<TagSelectionFormProps> = () => {
    const { t } = useTranslation();
    const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const { getGenre, updateGenre } = useMypageApi();

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const res = await getGenre();
                const genres = res.data.data.userGenres || [];
                const genreNames = genres.map(
                    (item: { genreName: string }) => item.genreName
                );
                setSelectedGenre(genreNames);
            } catch (error) {
                console.error("Failed to fetch user genres:", error);
            }
        };
        fetchGenre();
    }, [getGenre]);

    const genreGroups = [
        [t('Comedy'), t('Romance'), t('Thriller')],
        [t('Horror'), t('Disaster'), t('Crime'), t('Western'), t('History')],
        [t('Animation'), t('Documentary'), t('Action'), t('Fantasy'), t('Drama')],
        [t('Science Fiction'), t('Adventure'), t('Music'), t('Family'), t('War')],
    ];

    const genreNameToIdMap: { [key: string]: number } = {
        [t('Comedy')]: 35,
        [t('Romance')]: 10749,
        [t('Thriller')]: 53,
        [t('Horror')]: 27,
        [t('Disaster')]: 28, // 재난
        [t('Crime')]: 80,
        [t('Western')]: 37, // 서부
        [t('History')]: 36, // 역사
        [t('Animation')]: 16,
        [t('Documentary')]: 99,
        [t('Action')]: 28,
        [t('Fantasy')]: 14,
        [t('Drama')]: 18,
        [t('Science Fiction')]: 878,
        [t('Adventure')]: 12,
        [t('Music')]: 10402, // 음악
        [t('Family')]: 10751,
        [t('War')]: 10752,
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
        const genreIds = selectedGenre
            .map((name) => genreNameToIdMap[name])
            .filter((id) => id !== undefined);

        if (genreIds.length === 0) {
            alert(t('tagSelectionForm.validation.selectOneGenre'));
            return;
        }

        try {
            const res = await updateGenre(genreIds);
            console.log("장르 업데이트 성공:", res.data);
            alert(t('tagSelectionForm.update.success'));
        } catch (error) {
            console.error("장르 업데이트 실패:", error);
            alert(t('tagSelectionForm.update.failure'));
        }
    };

    return (
        <TagFormContent>
            <InfoText>
                {t('tagSelectionForm.infoText.part1')} <PinkText>{t('tagSelectionForm.infoText.againWord')}</PinkText> {t('tagSelectionForm.infoText.part2')}
                <br />
                {t('tagSelectionForm.infoText.part3')}
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
                            {t('tagSelectionForm.genrePrefix')} {genre}
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
                {t('confirm')}
            </ConfirmBtn>
        </TagFormContent>
    );
};

export default TagSelectionForm;