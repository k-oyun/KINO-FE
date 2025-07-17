// src/components/community/PostCard.tsx
import React from 'react';
import styled from 'styled-components';

// PostType 정의를 이 파일 내에 직접 선언
export type PostType = {
  id: string;
  title: string;
  username: string;
  createdAt: string;
  views: number;
  likeCount: number;
  tags: string[];
  movieId: string | null;
  movieTitle: string | null;
};

const CardContainer = styled.div`
  border: 1px solid #222222;
  border-radius: 8px;
  padding: 16px;
  background-color: #333333;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.2s ease;
  color: #f0f0f0;

  &:hover {
    background-color: #555555;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 4px;
  color: #f0f0f0;
`;

const PostMeta = styled.p`
  font-size: 0.9em;
  color: #bbb;
  line-height: 1.4;
`;

interface PostCardProps {
  post: PostType;
  onClick: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const createdAtDate = new Date(post.createdAt);
  const formattedDate = !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleDateString('ko-KR')
    : '날짜 정보 없음';

  return (
    <CardContainer onClick={() => onClick(post.id)}>
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>작성자: {post.username} | 날짜: {formattedDate}</PostMeta>
      <PostMeta>좋아요: {post.likeCount} | 조회수: {post.views}</PostMeta>
    </CardContainer>
  );
};

export default PostCard;
