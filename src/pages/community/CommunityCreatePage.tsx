import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import useReviewsApi from "../../api/reviews";
import { useMediaQuery } from "react-responsive";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTranslation } from "react-i18next";
import useHomeApi from "../../api/home";
import ProgressCircle from "../../components/ProgressCycle";
import { motion } from "framer-motion";
import { set } from "date-fns";
import { useDialog } from "../../context/DialogContext";

// 필요한 타입은 이 파일 내에서 직접 정의합니다.
// interface CreatePostRequest {
//   type?: string;
//   title: string;
//   content: string;
//   tags?: string[];
//   movieId?: string | null;
// }

interface styleType {
  $ismobile?: boolean;
}

interface MovieList {
  title: string;
  movie_id: number;
  still_cut_url: string;
  poster_url: string;
  release_date: string;
  plot: string;
  running_time: number;
  genres: string[];
}

const ListContainer = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: ${(props) => (props.$ismobile ? "0px" : "15px")};
  overflow-x: hidden;
  margin-top: 10px;
  backdrop-filter: blur(2px);
  z-index: 1000;
`;

const MovieContainer = styled.div`
  width: 100%;
  position: relative;
  right: 0px;
`;

const SelectedSliderTypeTxt = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "16px;" : "18px")};
  font-weight: 400;
  border-left: 4px solid #f06292;
  margin-left: ${(props) => (props.$ismobile ? "0px" : "10px")};
  padding-left: 10px;
`;

const MoviesSlider = styled.div<styleType>`
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-top: 15px;
  padding-bottom: 5px;
  padding-left: ${(props) => (props.$ismobile ? "0px" : "40px")};
  margin-right: ${(props) => (props.$ismobile ? "0px" : "40px")};
  overflow-y: hidden;
`;

const Movies = styled(motion.div)<styleType>`
  display: inline-block;
  width: ${(props) => (props.$ismobile ? "180px" : "250px")};
  height: ${(props) => (props.$ismobile ? "110px" : "150px")};
  margin-right: 8px;
  background-color: transparent;
  text-align: center;
  line-height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
`;

const SliderTypeTxt = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "16px;" : "18px")};
  font-weight: 400;
  margin-top: 0px;
  border-left: 4px solid #f06292;
  margin-left: ${(props) => (props.$ismobile ? "0px" : "40px")};
  padding-left: 10px;
`;

const MoviePosterImg = styled.img<styleType>`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
`;

const MovieTitleOverlay = styled.div<styleType>`
  position: absolute;
  bottom: ${(props) => (props.$ismobile ? "10px" : "40px")};
  width: 100%;
  background-color: transparent;
  color: white;
  font-size: ${(props) => (props.$ismobile ? "12px" : "20px")};
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Movies}:hover & {
    opacity: 1;
  }
`;

const SelectedMoviePoster = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "100px" : "144px")};
  height: ${(props) => (props.$ismobile ? "150px" : "207px")};
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SelectedMovie = styled.div<styleType>`
  display: flex;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-left: ${(props) => (props.$ismobile ? "10px" : "20px")};
  margin-right: ${(props) => (props.$ismobile ? "10px" : "40px")};
  margin-top: ${(props) => (props.$ismobile ? "10px" : "20px")};
`;

const SelectedMovieInfo = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: ${(props) => (props.$ismobile ? "10px" : "40px")};
  width: ${(props) => (props.$ismobile ? "160px" : "544px")};
`;

const SelectedMovieTitle = styled.h1<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1.2em" : "1.5em")};
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: normal;
`;

const SelectedMovieGenres = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "1em")};
  margin-top: ${(props) => (props.$ismobile ? "10px" : "20px")};
`;

const SelectedMoviePlot = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "0.9em")};
  margin-top: ${(props) => (props.$ismobile ? "10px" : "20px")};
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$ismobile ? "3" : "5")};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

const OutContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 65px;
`;

const PageWrapper = styled.div<styleType>`
  width: ${(props) => (props.$ismobile ? "90vw" : "60vw")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: ${(props) => (props.$ismobile ? "20px" : "50px")};
  border-radius: 8px;
  box-sizing: border-box;
`;

const PageTitle = styled.h2<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1.5em" : "2em")};
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label<styleType>`
  margin-bottom: 8px;
  font-size: 1em;
`;

const StyledInput = styled.input<styleType>`
  width: 100%;
  padding: 8px;
  border: none;
  font-size: 1em;
  border-bottom: 2px solid #ccc;
  background-color: ${({ theme }) =>
    theme.backgroundColor === "#ffffff" ? "#ffffff" : "transparent"};
  color: ${({ theme }) => theme.textColor};
  &:focus {
    outline: none;
    border-color: #fe5890;
  }
`;

const EditorWrapper = styled.div<styleType>`
  width: 100%;
  border-radius: 8px;
  .ck-editor__editable_inline {
    min-height: ${(props) => (props.$ismobile ? "150px" : "300px")};
    background-color: ${({ theme }) => theme.backgroundColor} !important;
    color: ${({ theme }) => theme.textColor} !important;
    border: 2px solid #555 !important;
    border-radius: 0 0 8px 8px !important;
  }
  .ck-toolbar {
    background-color: ${({ theme }) =>
      theme.backgroundColor === "#ffffff" ? "#ffffff" : "#999"} !important;
    border: none !important;
  }
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 1.1em;
  cursor: pointer;
  background-color: #fd6782;
  color: white;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f73c63;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 16px;
  text-align: center;
  font-size: 1em;
`;

const CommunityCreatePage: React.FC = () => {
  const { openDialog, closeDialog } = useDialog();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [movieId, setMovieId] = useState<number>(0);
  const [movieKeyword, setMovieKeyword] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState<MovieList[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { id } = useParams<{ id: string }>();
  const { movie } = useParams<{ movie: string }>();
  const { postReview, updateReview, getReviewById, uploadImage } =
    useReviewsApi();
  const { searchHomeApi } = useHomeApi();
  const movieProgressTimer = useRef<number | null>(null);
  const [movieProgressKey, setMovieProgressKey] = useState<string | null>(null);
  const [movieHoverProgress, setMovieHoverProgress] = useState(0);
  const movieHoverTimer = useRef<number | null>(null);

  const editConfirm = (id: string) => {
    openDialog({
      title: t("editTitle"),
      message: t("editConfirmMessage"),
      showCancel: true,
      isRedButton: true,
      onConfirm: () => {
        closeDialog();
        goUpdateReview(id);
      },
      onCancel: () => {
        closeDialog();
      },
    });
  };

  const goUpdateReview = (id: string) => {
    const res = updateReview(title, content, movieId, parseInt(id));
    res.then((data) => {
      console.log("게시글 수정 성공:", data.data);
      navigate(`/community/${data.data.data}`);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      if (id) {
        // 수정 모드
        editConfirm(id);
      } else {
        const res = postReview(title, content, movieId);
        res.then((data) => {
          console.log("게시글 작성 성공:", data.data);
          navigate(`/community/${data.data.data}`);
        });
      }
    } catch (e) {
      console.error("Failed to create post:", e);
      setError("게시글 작성에 실패했습니다. 다시 시도해주세요.");
      openDialog({
        title: t("editTitle"),
        message: t("writeErrorMessage"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => closeDialog(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovieByTitle = async (title: string) => {
    if (!title.trim()) {
      setSearchedMovieList([]);
      return;
    }
    try {
      const res = searchHomeApi(title);
      res.then((data) => {
        console.log("영화 검색 결과:", data.data);
        const movieData = data.data.data[0];
        if (movieData) {
          setSelectedMovie(movieData);
          setMovieId(movieData.movie_id);
        } else {
          setError("해당 영화를 찾을 수 없습니다.");
        }
      });
    } catch (error) {
      console.error("영화 검색 중 오류 발생:", error);
      setError("영화 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (id) {
      // 수정 모드
      const fetchReview = async () => {
        try {
          const res = getReviewById(id);
          res.then((data) => {
            console.log("불러온 게시글 데이터:", data.data);
            setTitle(data.data.data.reviewTitle);
            setContent(data.data.data.reviewContent);
            setMovieId(data.data.data.movieId);
            searchMovieByTitle(data.data.data.movieTitle);
          });
        } catch (e) {
          console.error("Failed to fetch review for editing:", e);
          setError("게시글을 불러오는데 실패했습니다.");
        }
      };
      fetchReview();
    }
    if (movie) {
      // 영화 제목이 있을 경우 -> 영화 상세 페이지에서 글쓰기 들어옴
      searchMovieByTitle(movie);
    }
  }, [id, movie]);

  const customUploadAdapter = (loader: any) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          loader.file.then((file: any) => {
            const res = uploadImage(file);
            res
              .then((res) => {
                resolve({
                  default: `${res.data.url}`,
                });
              })
              .catch((err) => reject(err));
          });
        });
      },
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return customUploadAdapter(loader);
    };
  }

  useEffect(() => {
    // 영화 검색 로직
    const res = searchHomeApi(movieKeyword);
    res
      .then((data) => {
        console.log("영화 검색 결과:", data.data);
        setSearchedMovieList(data.data.data);
      })
      .catch((error) => {
        console.error("영화 검색 실패:", error);
        setError("영화를 찾을 수 없습니다. 다시 시도해주세요.");
      });
  }, [movieKeyword]);

  const handleMovieHoverLeave = () => {
    if (movieHoverTimer.current) clearTimeout(movieHoverTimer.current);
    if (movieProgressTimer.current) clearInterval(movieProgressTimer.current);
    setMovieProgressKey(null);
    setMovieHoverProgress(0);
  };

  return (
    <OutContainer>
      <PageWrapper $ismobile={isMobile}>
        <PageTitle $ismobile={isMobile}>{t("writeNewReview")}</PageTitle>
        {/* TODO: 영화 선택 UI 및 로직 추가 (예: 드롭다운 또는 검색 모달) */}
        <FormGroup>
          <StyledInput
            id="movie"
            type="text"
            placeholder="영화 검색"
            value={movieKeyword}
            onChange={(e) => setMovieKeyword(e.target.value)}
            disabled={isLoading}
          />
          {movieKeyword !== "" && (
            <ListContainer $ismobile={isMobile}>
              <MovieContainer>
                <SliderTypeTxt $ismobile={isMobile}>
                  <span>검색 결과</span>
                </SliderTypeTxt>
                <MoviesSlider $ismobile={isMobile}>
                  {searchedMovieList.map((movie, i) => (
                    <Movies
                      $ismobile={isMobile}
                      key={movie.movie_id ?? i}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 30px 30px rgba(0,0,0,0.25)",
                        zIndex: 10,
                        borderRadius: "15px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      }}
                      onClick={() => {
                        setMovieId(movie.movie_id);
                        setMovieKeyword("");
                        setSelectedMovie(movie);
                      }}
                      onMouseLeave={handleMovieHoverLeave}
                    >
                      {movieProgressKey === `searched-${i}` &&
                        movieHoverProgress > 0 &&
                        movieHoverProgress < 100 && (
                          <ProgressCircle progress={movieHoverProgress} />
                        )}
                      {movie.still_cut_url ? (
                        <>
                          <MoviePosterImg
                            $ismobile={isMobile}
                            src={movie.still_cut_url}
                            alt={movie.title}
                          />
                          <MovieTitleOverlay $ismobile={isMobile}>
                            {movie.title}
                          </MovieTitleOverlay>
                        </>
                      ) : (
                        <></>
                      )}
                    </Movies>
                  ))}
                </MoviesSlider>
              </MovieContainer>
            </ListContainer>
          )}
          {movieId > 0 && (
            <ListContainer $ismobile={isMobile}>
              <MovieContainer>
                <SelectedSliderTypeTxt $ismobile={isMobile}>
                  <span>선택된 영화</span>
                </SelectedSliderTypeTxt>
                <SelectedMovie $ismobile={isMobile}>
                  {movieProgressKey === `selected-${movieId}` &&
                    movieHoverProgress > 0 &&
                    movieHoverProgress < 100 && (
                      <ProgressCircle progress={movieHoverProgress} />
                    )}
                  <SelectedMoviePoster
                    $ismobile={isMobile}
                    src={selectedMovie?.poster_url}
                    alt={"영화 포스터"}
                  />
                  <SelectedMovieInfo $ismobile={isMobile}>
                    <SelectedMovieTitle $ismobile={isMobile}>
                      {selectedMovie?.title}
                    </SelectedMovieTitle>
                    <SelectedMovieGenres $ismobile={isMobile}>
                      {selectedMovie?.genres.join(", ")}
                    </SelectedMovieGenres>
                    <SelectedMoviePlot $ismobile={isMobile}>
                      {selectedMovie?.plot}
                    </SelectedMoviePlot>
                  </SelectedMovieInfo>
                </SelectedMovie>
              </MovieContainer>
            </ListContainer>
          )}
        </FormGroup>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            {/* <Label htmlFor="title">{t("title")}</Label> */}
            <StyledInput
              $ismobile={isMobile}
              id="title"
              type="text"
              placeholder={t("titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              style={{ marginTop: "14px" }}
            />
          </FormGroup>

          <FormGroup>
            <EditorWrapper $ismobile={isMobile}>
              <CKEditor
                editor={ClassicEditor as any}
                data={content}
                onChange={(_, editor) => {
                  setContent(editor.getData()); // HTML string 저장
                }}
                config={{
                  placeholder: t("contentPlaceholder"),
                  licenseKey: "GPL",
                  extraPlugins: [uploadPlugin],
                }}
              />
            </EditorWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "24px",
            }}
          >
            <SubmitButton
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? t("writing") : t("completed")}
            </SubmitButton>
          </div>
        </form>
      </PageWrapper>
    </OutContainer>
  );
};

export default CommunityCreatePage;
