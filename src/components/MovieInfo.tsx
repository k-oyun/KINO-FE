import styled from "styled-components";
import { useTranslation } from "react-i18next";

interface MovieInfoProps {
  isMobile: boolean;
  movieDetail: {
    movieId: number;
    title: string;
    plot: string;
    backdropUrl: string;
    releaseDate: string;
    runningTime: number;
    ageRating: string;
    avgRating: number;
    genres: string[];
    director: string;
    actors: [{ name: string; profileUrl: string }];
    otts: [{ name: string; logoUrl: string; linkUrl: string }];
    teaserUrl: string;
  };
}

interface styleType {
  $ismobile: boolean;
}

const MovieInfoContainer = styled.div<styleType>`
  width: 100%;
`;

const MovieOverview = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
  border-bottom: 1px solid #ccc;
  padding: ${(props) => (props.$ismobile ? "20px 10px" : "30px 30px")};
  line-height: 1.5;
`;

const InfoGrid = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
`;
const InfoItem = styled.div<styleType>`
  display: flex;
  width: ${(props) => (props.$ismobile ? "100%" : "50%")};
  /* margin-bottom: 16px; */
  margin: ${(props) => (props.$ismobile ? "10px 0" : "20px 0")};
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
  margin-bottom: ${(props) => (props.$ismobile ? "10px" : "15px")};
`;
const ActorList = styled.ul<styleType>`
  display: flex;
  overflow-x: auto;
  height: 150px;
  padding: ${(props) => (props.$ismobile ? "5px" : "10px")};
`;
const ActorItem = styled.li<styleType>`
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  word-break: keep-all;
  margin-right: ${(props) => (props.$ismobile ? "15px" : "40px")};
`;
const ActorImg = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "55px" : "90px")};
  height: ${(props) => (props.$ismobile ? "55px" : "90px")};
  margin-bottom: 8px;
  border-radius: 50%;
  object-fit: cover;
`;

const MovieWhereToWatch = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
`;
const OttLabel = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "18px" : "24px")};
  margin-bottom: ${(props) => (props.$ismobile ? "10px" : "15px")};
`;
const OttList = styled.ul<styleType>`
  /* background-color: #f9f9f9; */
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "10px")};
`;
const OttLogo = styled.img<{ $ismobile: boolean }>`
  width: ${(props) => (props.$ismobile ? "45px" : "60px")};
  height: ${(props) => (props.$ismobile ? "45px" : "60px")};
  margin-right: 10px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }
`;

const MovieTrailer = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "20px 10px" : "30px")};
`;
const TrailerLabel = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "18px" : "24px")};
  margin-bottom: ${(props) => (props.$ismobile ? "10px" : "15px")};
`;

const TrailerStyle = styled.iframe<styleType>`
  width: 100%;
  height: ${(props) => (props.$ismobile ? "300px" : "500px")};
  border: none;
  border-radius: 8px;
`;

function getYouTubeVideoId(url: string) {
  if (!url) return null;
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

const MovieInfo = ({ isMobile, movieDetail }: MovieInfoProps) => {
  const { t } = useTranslation();
  const videoId = getYouTubeVideoId(movieDetail.teaserUrl);

  return (
    <MovieInfoContainer $ismobile={isMobile}>
      <MovieOverview $ismobile={isMobile}>{movieDetail.plot}</MovieOverview>
      <InfoGrid $ismobile={isMobile}>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>{t("genres")}</InfoLabel>
          <InfoValue>
            {movieDetail.genres.map((genre) => genre).join(", ")}
          </InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>{t("releaseDate")}</InfoLabel>
          <InfoValue>{movieDetail.releaseDate}</InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>{t("filmRating")}</InfoLabel>
          <InfoValue>
            {movieDetail.ageRating
              ? movieDetail.ageRating === "ALL"
                ? movieDetail.ageRating
                : movieDetail.ageRating + "+"
              : "-"}
          </InfoValue>
        </InfoItem>
        <InfoItem $ismobile={isMobile}>
          <InfoLabel>{t("runningTime")}</InfoLabel>
          <InfoValue>
            {movieDetail.runningTime} {t("minutes")}
          </InfoValue>
        </InfoItem>
      </InfoGrid>
      <MovieActors $ismobile={isMobile}>
        <ActorLabel $ismobile={isMobile}>{t("actors")}</ActorLabel>
        <ActorList $ismobile={isMobile}>
          {movieDetail.actors.map((actor) => (
            <ActorItem key={actor.name} $ismobile={isMobile}>
              <ActorImg
                $ismobile={isMobile}
                src={`https://image.tmdb.org/t/p/w45${actor.profileUrl}`}
                alt={actor.name}
              />
              {actor.name}
            </ActorItem>
          ))}
        </ActorList>
      </MovieActors>
      <MovieWhereToWatch $ismobile={isMobile}>
        <OttLabel $ismobile={isMobile}>{t("whereToWatch")}</OttLabel>
        <OttList $ismobile={isMobile}>
          {movieDetail.otts.length > 0 ? (
            movieDetail.otts.map((ott) => (
              <OttLogo
                key={ott.name}
                src={ott.logoUrl}
                onClick={() => window.open(ott.linkUrl, "_blank")}
                alt={ott.name}
                $ismobile={isMobile}
              ></OttLogo>
            ))
          ) : (
            <>{t("nowhereToWatch")}</>
          )}
        </OttList>
      </MovieWhereToWatch>
      <MovieTrailer $ismobile={isMobile}>
        <TrailerLabel $ismobile={isMobile}>{t("trailer")}</TrailerLabel>
        <TrailerStyle
          $ismobile={isMobile}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${movieDetail.title} teaser video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></TrailerStyle>
      </MovieTrailer>
    </MovieInfoContainer>
  );
};

export default MovieInfo;
