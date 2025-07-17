import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 필요한 타입은 이 파일 내에서 직접 정의합니다.
// interface CreatePostRequest {
//   type?: string;
//   title: string;
//   content: string;
//   tags?: string[];
//   movieId?: string | null;
// }

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 100px auto 24px;
  padding: 25px;
  box-sizing: border-box;
  color: #f0f0f0;
  background-color: #000000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const PageTitle = styled.h2`
  font-size: 2em;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1em;
  color: #bbb;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  background-color: #333333;
  border: 1px solid #222222;
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 1em;
  &:focus {
    outline: none;
    border-color: #fe5890;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  background-color: #333333;
  border: 1px solid #222222;
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 1em;
  min-height: 150px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #fe5890;
  }
`;

const SubmitButton = styled.button`
  background-color: #9baa59;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #9baa59D0;
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [movieId, setMovieId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const formData = new FormData();
      formData.append('type', 'MOVIE_REVIEW');
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      if (movieId) {
        formData.append('movieId', movieId);
      }
      tags.forEach(tag => formData.append('tags', tag));

      await axios.post("/api/board/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("게시글이 성공적으로 작성되었습니다.");
      navigate("/community");
    } catch (e) {
      console.error("Failed to create post:", e);
      setError("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <PageWrapper>
      <PageTitle>새 게시글 작성</PageTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">제목</Label>
          <StyledInput
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">내용</Label>
          <StyledTextArea
            id="content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="image">이미지 첨부 (선택 사항)</Label>
          <StyledInput
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
          />
          {image && <p style={{ color: '#bbb', fontSize: '0.9em', marginTop: '4px' }}>선택된 파일: {image.name}</p>}
        </FormGroup>

        {/* TODO: 영화 선택 UI 및 로직 추가 (예: 드롭다운 또는 검색 모달) */}
        <FormGroup>
            <Label htmlFor="movie">영화 선택 (선택 사항)</Label>
            <StyledInput
                id="movie"
                type="text"
                placeholder="영화 검색 또는 ID 입력"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                disabled={isLoading}
            />
        </FormGroup>

        {/* TODO: 태그 입력 UI 및 로직 추가 (예: 콤마로 구분하거나, 개별 입력 후 추가) */}
        <FormGroup>
            <Label htmlFor="tags">태그 (쉼표로 구분, 선택 사항)</Label>
            <StyledInput
                id="tags"
                type="text"
                placeholder="태그1, 태그2, 태그3"
                value={tags.join(',')}
                onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                disabled={isLoading}
            />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '작성 중...' : '작성 완료'}
          </SubmitButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default CommunityCreatePage;
