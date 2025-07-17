import { useEffect, useState } from "react";
import styled from "styled-components";

const movieDetail = {
  id: 603692,
  title: "Inside Out 2",
  original_title: "Inside Out 2",
  overview:
    "조이와 친구들이 돌아왔다! 라일리의 머릿속 감정 컨트롤 본부에 새로운 감정들이 등장하면서 벌어지는 유쾌한 모험.",
  release_date: "2024-06-12",
  runtime: 98,
  genres: [
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 10751, name: "Family" },
  ],
  poster_path: "/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
  backdrop_path: "/u3YQJctMzFN2wAvnkmXy41bXhFv.jpg",
  vote_average: 7.8,
  vote_count: 1234,
  adult: false,
  status: "Released",
  tagline: "새로운 감정, 새로운 모험!",
  spoken_languages: [
    { iso_639_1: "en", name: "English" },
    { iso_639_1: "ko", name: "Korean" },
  ],
  production_countries: [
    { iso_3166_1: "US", name: "United States of America" },
  ],
  production_companies: [
    {
      id: 3,
      name: "Pixar",
      logo_path: "/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png",
      origin_country: "US",
    },
    {
      id: 2,
      name: "Walt Disney Pictures",
      logo_path: "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
      origin_country: "US",
    },
  ],
  homepage: "https://movies.disney.com/inside-out-2",
  imdb_id: "tt1234567",
};

interface MovieInfoProps {
  isMobile: boolean;
  movieId: number;
}

interface styleType {
  $ismobile: boolean;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

const MovieInfoContainer = styled.div<styleType>`
  width: 100%;
`;

const MovieOverview = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
  border-bottom: 1px solid #ccc;
  padding: ${(props) => (props.$ismobile ? "14px 10px" : "20px 30px")};
`;

const InfoGrid = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* width: 100%; */
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
`;
const InfoItem = styled.div<styleType>`
  display: flex;
  width: ${(props) => (props.$ismobile ? "100%" : "50%")};
  margin-bottom: 16px;
`;
const InfoLabel = styled.div`
  width: 110px; // 라벨 고정 너비
  font-weight: bold;
`;
const InfoValue = styled.div`
  margin-left: 12px;
`;

const MovieActors = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
`;
const ActorLabel = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "18px" : "24px")};
  /* margin-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")}; */
`;
const ActorList = styled.ul<styleType>``;

const MovieWhereToWatch = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
`;
const OttLabel = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "18px" : "24px")};
  /* margin-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")}; */
`;
const OttList = styled.ul<styleType>`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "10px")};
`;
const OttLogo = styled.img<{ $ismobile: boolean }>`
  width: ${(props) => (props.$ismobile ? "45px" : "60px")};
  height: ${(props) => (props.$ismobile ? "45px" : "60px")};
  margin-right: 10px;
  border-radius: 8px;
`;

const MovieTrailer = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
`;
const TrailerLabel = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "18px" : "24px")};
`;

const MovieInfo = ({ isMobile, movieId }: MovieInfoProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // 영화 상세 정보를 가져오는 로직
    console.log(`Fetching details for movie ID: ${movieId}`);
    // 볼 수 있는 곳
    fetch(
      "https://api.themoviedb.org/3/movie/729854/watch/providers?api_key=83ea6f477712d1b2a2d27b67c0b679fe"
    )
      .then((response) => response.json())
      .then((data) => {
        setProviders(data.results?.KR?.flatrate || []);
        console.log("Watch providers:", data.results?.KR?.flatrate || []);
      });
  }, []);

  return (
    <MovieInfoContainer $ismobile={isMobile}>
      <MovieOverview $ismobile={isMobile}>{movieDetail.overview}</MovieOverview>
      <InfoGrid $ismobile={isMobile}>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>장르</InfoLabel>
          <InfoValue>
            {movieDetail.genres.map((genre) => genre.name).join(", ")}
          </InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>개봉일</InfoLabel>
          <InfoValue>{movieDetail.release_date}</InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>연령 등급</InfoLabel>
          <InfoValue>
            {movieDetail.adult ? "19세 미만 관람 불가" : "흠..adult만 주나?"}
          </InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>러닝 타임</InfoLabel>
          <InfoValue>{movieDetail.runtime} 분</InfoValue>
        </InfoItem>
      </InfoGrid>
      <MovieActors $ismobile={isMobile}>
        <ActorLabel $ismobile={isMobile}>출연진/제작진</ActorLabel>
        <ActorList $ismobile={isMobile}></ActorList>
      </MovieActors>
      <MovieWhereToWatch $ismobile={isMobile}>
        <OttLabel $ismobile={isMobile}>볼 수 있는 곳</OttLabel>
        <OttList $ismobile={isMobile}>
          {providers.map((provider) => (
            <OttLogo
              key={provider.provider_id}
              src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
              alt={provider.provider_name}
              $ismobile={isMobile}
            ></OttLogo>
          ))}
        </OttList>
      </MovieWhereToWatch>
      <MovieTrailer $ismobile={isMobile}>
        <TrailerLabel $ismobile={isMobile}>영상</TrailerLabel>
      </MovieTrailer>
    </MovieInfoContainer>
  );
};

export default MovieInfo;
