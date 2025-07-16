import styled from "styled-components";

interface GeneralMovieProps {
  isMobile: boolean;
  movieDetail: {
    title: string;
    release_date: string;
    backdrop_path: string;
    vote_average: number;
  };
}

interface styleType {
  $ismobile: boolean;
}

const GeneralMovieInfoContainer = styled.div<{ $imgurl: string } & styleType>`
  height: 50vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$imgurl});
  background-size: contain;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  color: white;
  padding: ${(props) => (props.$ismobile ? "20px" : "40px")};
`;

const Title = styled.h1<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1.5em" : "2.5em")};
  margin-top: 220px;
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
  const imgUrl = `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}`;
  return (
    <GeneralMovieInfoContainer $ismobile={isMobile} $imgurl={imgUrl}>
      <Title $ismobile={isMobile}>{movieDetail.title}</Title>
      <ReleaseDate $ismobile={isMobile}>{movieDetail.release_date}</ReleaseDate>
      <Star $ismobile={isMobile}>★ {movieDetail.vote_average}</Star>
    </GeneralMovieInfoContainer>
  );
};

export default GeneralMovieInfo;
