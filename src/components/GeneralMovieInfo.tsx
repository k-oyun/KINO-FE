import styled from "styled-components";

interface TagSelectorProps {
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
  width: 100%;
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

const GeneralMovieInfo = ({ isMobile, movieDetail }: TagSelectorProps) => {
  const imgUrl = `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}`;
  return (
    <GeneralMovieInfoContainer $ismobile={isMobile} $imgurl={imgUrl}>
      <h1>{movieDetail.title}</h1>
      <p>{movieDetail.release_date}</p>
      <p>평점: {movieDetail.vote_average}</p>
    </GeneralMovieInfoContainer>
  );
};

export default GeneralMovieInfo;
