import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/mypage/MovieCard";

import useMypageApi from "../../api/mypage";

interface FavoriteMovieType {
    myPickId: string;
    movieTitle: string;
    director: string;
    releaseDate: string;
    posterUrl: string;
}

// const DUMMY_FAVORITE_MOVIES: FavoriteMovieType[] = [
//   { id: 'fm1', title: '인터스텔라', director: '크리스토퍼 놀란', releaseDate: '2014', posterUrl: 'https://via.placeholder.com/200x300/3498db/ffffff?text=Interstellar' },
//   { id: 'fm2', title: '아바타: 물의 길', director: '제임스 카메론', releaseDate: '2022', posterUrl: 'https://via.placeholder.com/200x300/9b59b6/ffffff?text=Avatar2' },
//   { id: 'fm3', title: '스파이더맨: 노 웨이 홈', director: '존 왓츠', releaseDate: '2021', posterUrl: 'https://via.placeholder.com/200x300/e67e22/ffffff?text=Spiderman' },
//   { id: 'fm4', title: '기생충', director: '봉준호', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/27ae60/ffffff?text=Parasite' },
//   { id: 'fm5', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
//   { id: 'fm6', title: '명량', director: '김한민', releaseDate: '2014', posterUrl: 'https://via.placeholder.com/200x300/f39c12/ffffff?text=Myeongnyang' },
//   { id: 'fm7', title: '극한직업', director: '이병헌', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/1abc9c/ffffff?text=Extreme+Job' },
//   { id: 'fm8', title: '겨울왕국 2', director: '크리스 벅, 제니퍼 리', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/95a5a6/ffffff?text=Frozen2' },
//   { id: 'fm9', title: '테넷', director: '크리스토퍼 놀란', releaseDate: '2020', posterUrl: 'https://via.placeholder.com/200x300/7f8c8d/ffffff?text=Tenet' },
//   { id: 'fm10', title: '어벤져스: 인피니티 워', director: '안소니 루소, 조 루소', releaseDate: '2018', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=Infinity+War' },
//   { id: 'fm11', title: '소울', director: '피트 닥터', releaseDate: '2020', posterUrl: 'https://via.placeholder.com/200x300/2980b9/ffffff?text=Soul' },
//   { id: 'fm12', title: '토이 스토리 4', director: '조시 쿨리', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/e74c3c/ffffff?text=Toy+Story4' },
//   { id: 'fm13', title: '토이 스토리 4', director: '조시 쿨리', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/e74c3c/ffffff?text=Toy+Story4' },
//   { id: 'fm14', title: '토이 스토리 4', director: '조시 쿨리', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/e74c3c/ffffff?text=Toy+Story4' },
//   { id: 'fm15', title: '토이 스토리 4', director: '조시 쿨리', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/e74c3c/ffffff?text=Toy+Story4' },
// ];

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 300px;
    background-color: transparent;
    // min-height: calc(100vh - 60px);
    max-height: 100vh;
    color: #f0f0f0;

    display: flex;
    flex-direction: column;

    @media (max-width: 767px) {
        padding: 20px 15px;
        padding-top: 80px;
    }
`;

const SectionWrapper = styled.div`
    background-color: #000000;
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 767px) {
        padding: 20px;
    }
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 15px;
    }
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: #f0f0f0;
    font-size: 2em;
    margin-right: 15px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateX(-5px);
    }

    svg {
        width: 24px;
        height: 24px;
        vertical-align: middle;
    }

    @media (max-width: 767px) {
        margin-right: 0;
        margin-bottom: 10px;
        align-self: flex-start;
    }
`;

const PageTitle = styled.h1`
    font-size: 1.8em;
    font-weight: bold;
    color: #e0e0e0;

    @media (max-width: 767px) {
        font-size: 1.4em;
    }
    @media (max-width: 480px) {
        font-size: 1.2em;
    }
`;

const MovieCardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding-top: 10px;

    @media (max-width: 767px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
    }
    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
    }
`;

const EmptyState = styled.div`
    color: #aaa;
    text-align: center;
    padding: 30px 0;
    font-size: 1.1em;

    @media (max-width: 767px) {
        padding: 20px 0;
        font-size: 1em;
    }
`;

const MyFavoriteMoviesPage: React.FC = () => {
    const navigate = useNavigate();
    const { mypageMyPickMovie } = useMypageApi();

    // const favoriteMovies = DUMMY_FAVORITE_MOVIES;
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>(
        []
    );

    useEffect(() => {
        const myPickGet = async () => {
            const res = await mypageMyPickMovie();
            const pick = Array.isArray(res.data.data.myPickMoives)
                ? res.data.data.myPickMoives
                : [];
            console.log(res.data.data);
            setFavoriteMovies(pick);
        };
        myPickGet();
    }, []);

    return (
        <PageContainer>
            <SectionWrapper>
                <PageHeader>
                    <BackButton onClick={() => navigate("/mypage")}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 5L9 12L15 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </BackButton>
                    <PageTitle>내가 찜한 영화</PageTitle>
                </PageHeader>
                {favoriteMovies && favoriteMovies.length > 0 ? (
                    <MovieCardGrid>
                        {favoriteMovies.map((movie: FavoriteMovieType) => (
                            <MovieCard key={movie.myPickId} movie={movie} />
                        ))}
                    </MovieCardGrid>
                ) : (
                    <EmptyState>찜한 영화가 없습니다.</EmptyState>
                )}
            </SectionWrapper>
        </PageContainer>
    );
};

export default MyFavoriteMoviesPage;
