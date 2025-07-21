import styled from "styled-components";
import useMovieDetailApi from "../api/details";
import { useEffect, useState } from "react";

interface GeneralMovieProps {
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
    genreIds: number[];
    director: string;
    actors: [{ name: string; profileUrl: string }];
    otts: [{ name: string; logoUrl: string; linkUrl: string }];
    teaserUrl: string;
  };
}

interface styleType {
  $ismobile: boolean;
}

const GeneralMovieInfoContainer = styled.div<{ $imgurl: string } & styleType>`
  height: 50vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$imgurl});
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  color: white;
  padding: ${(props) => (props.$ismobile ? "20px" : "100px")};
`;

const TitleNZzim = styled.div<styleType>`
  display: flex;
  margin-top: 220px;
`;

const Title = styled.h1<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1.5em" : "2.5em")};
  margin-right: ${(props) => (props.$ismobile ? "3px" : "10px")};
`;

const ZzimBtn = styled.img<styleType>`
  cursor: pointer;
  width: ${(props) => (props.$ismobile ? "30px" : "50px")};
  height: ${(props) => (props.$ismobile ? "30px" : "50px")};
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
`;

const ReleaseDate = styled.p<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1em" : "1.5em")};
  margin: 10px 0;
`;

const Star = styled.p<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1em" : "1.5em")};
  margin: 10px 0;
`;

const GeneralMovieInfo = ({ isMobile, movieDetail }: GeneralMovieProps) => {
  const { getIsPicked, postMyPick, deleteMyPick } = useMovieDetailApi();
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    try {
      const res = getIsPicked(movieDetail.movieId);
      res.then((data) => {
        console.log("Is movie picked:", data.data.data);
        setPicked(data.data.data);
      });
    } catch (error) {
      console.error("Error fetching isPicked status:", error);
    }
  }, []);

  const handlePickClick = async () => {
    try {
      if (picked) {
        await deleteMyPick(movieDetail.movieId);
        setPicked(false);
      } else {
        await postMyPick(movieDetail.movieId);
        setPicked(true);
      }
    } catch (error) {
      console.error("Error toggling pick status:", error);
    }
  };

  return (
    <GeneralMovieInfoContainer
      $ismobile={isMobile}
      $imgurl={movieDetail.backdropUrl}
    >
      <TitleNZzim $ismobile={isMobile}>
        <Title $ismobile={isMobile}>{movieDetail.title}</Title>
        <ZzimBtn
          $ismobile={isMobile}
          src={
            picked
              ? "https://img.icons8.com/?size=100&id=sNkxoEmmSa4R&format=png&color=000000"
              : "https://img.icons8.com/?size=100&id=72733&format=png&color=FA5252"
          }
          alt="zzim"
          onClick={handlePickClick}
        ></ZzimBtn>
      </TitleNZzim>
      <ReleaseDate $ismobile={isMobile}>{movieDetail.releaseDate}</ReleaseDate>
      <Star $ismobile={isMobile}>★ {movieDetail.avgRating}</Star>
    </GeneralMovieInfoContainer>
  );
};

export default GeneralMovieInfo;
