import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import useReviewsApi from "../../api/reviews";
import { useMediaQuery } from "react-responsive";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
  border: 1px solid #222222;
  border-radius: 8px;
  font-size: 1em;
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
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [movieId, setMovieId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { id } = useParams<{ id: string }>();
  const { postReview, updateReview, getReviewById } = useReviewsApi();

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
        const payload = {
          reviewTitle: title,
          reviewContent: content,
          movieId: movieId,
          reviewId: parseInt(id),
        };
        const res = updateReview(payload);
        res.then((data) => {
          console.log("게시글 수정 성공:", data.data);
          navigate(`/community/${data.data.reviewId}`);
        });
        return;
      } else {
        const payload = {
          reviewTitle: title,
          reviewContent: content,
          movieId: movieId,
        };
        const res = postReview(payload);
        res.then((data) => {
          console.log("게시글 작성 성공:", data.data);
          navigate(`/community/${data.data.reviewId}`);
        });
      }
    } catch (e) {
      console.error("Failed to create post:", e);
      setError("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
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
            setMovieId(data.data.data.movieId || 0);
          });
        } catch (e) {
          console.error("Failed to fetch review for editing:", e);
          setError("게시글을 불러오는데 실패했습니다.");
        }
      };
      fetchReview();
    }
  }, [id]);

  return (
    <OutContainer>
      <PageWrapper $ismobile={isMobile}>
        <PageTitle $ismobile={isMobile}>새 게시글 작성</PageTitle>
        {/* TODO: 영화 선택 UI 및 로직 추가 (예: 드롭다운 또는 검색 모달) */}
        <FormGroup>
          <Label htmlFor="movie">영화 선택 (선택 사항)</Label>
          <StyledInput
            id="movie"
            type="text"
            placeholder="영화 검색 또는 ID 입력"
            value={movieId}
            onChange={(e) =>
              setMovieId(e.target.value ? parseInt(e.target.value) : 0)
            }
            disabled={isLoading}
          />
        </FormGroup>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <StyledInput
              $ismobile={isMobile}
              id="title"
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <EditorWrapper $ismobile={isMobile}>
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(_, editor) => {
                  setContent(editor.getData()); // HTML string 저장
                }}
                config={{
                  placeholder: "내용을 입력하세요...",
                  licenseKey: "GPL",
                  simpleUpload: {
                    uploadUrl: "http://43.203.218.183:8080/api/img",
                    // Enable the XMLHttpRequest.withCredentials property.
                    // withCredentials: true,

                    // Headers sent along with the XMLHttpRequest to the upload server.
                    headers: {
                      Authorization:
                        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1NSIsInR5cGUiOiJBQ0NFU1MiLCJhdXRoIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzUyODk5Nzg4LCJleHAiOjE3NTI5MDMzODh9.vE6HLt2KQO13onSQQNKL_cw9WMetCgfl6k5YHSWDrE2bPhpX91Os0fUTE_KcGKOJprd9Ybvt9BRym5pvE0GhJA",
                    },
                  },
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
              {isLoading ? "작성 중..." : "작성 완료"}
            </SubmitButton>
          </div>
        </form>
      </PageWrapper>
    </OutContainer>
  );
};

export default CommunityCreatePage;
