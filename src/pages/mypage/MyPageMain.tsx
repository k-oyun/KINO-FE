import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { useRecoilValue } from 'recoil';

// import { fetchUserProfile, fetchMyShortReviewsPreview, fetchMyDetailReviewsPreview, fetchMyFavoriteMoviesPreview } from '../../api/users';

// 더미데이터로 일단 처리
// import UserProfileSection from '../../components/mypage/UserProfileSection';
// import ReviewPreviewSection from '../../components/mypage/ReviewPreviewSection';
// import MoviePreviewSection from '../../components/mypage/MoviePreviewSection';

// import { authState } from '../../store/authState';


// 1. 스타일 정의
const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #1a1a1a;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;
`;

const SectionWrapper = styled.section`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 1em;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #f0f0f0;
  }
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EmptyState = styled.div`
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;
`;

// 2. 더미 데이터 정의
const DUMMY_USER_PROFILE = {
  nickname: 'Nick_name',
  profileImageUrl: 'https://via.placeholder.com/100/3498db/ffffff?text=User',
  followerCount: 123,
  followingCount: 45,
};

const DUMMY_SHORT_REVIEWS = [
  { id: 'sr1', movieTitle: '노이즈', content: '무서워요 무서워요무서워요무서워요무서워요무서워요', rating: 4.5, likeCount: 7, createdAt: '2023.08.15 11:00' },
  { id: 'sr2', movieTitle: '타이타닉', content: '잭과 로즈의 아름다운 사랑 이야기. OST가 정말 좋아요!', rating: 5.0, likeCount: 25, createdAt: '2023.07.20 14:30' },
];

const DUMMY_DETAIL_REVIEWS = [
  {
    id: 'dr1',
    movieTitle: '엘리오',
    moviePosterUrl: 'https://via.placeholder.com/100x150/e74c3c/ffffff?text=Poster1',
    title: '엘리오 내용 평가 4.0',
    content: '엘리오는 영화 (콜 미 바이 유어 네임) 속에서 섬세하고 감성적인 소년으로 그려진다. 그는 이탈리아의 한적한 시골 마을에서 가족과 함께 지내며 지적이고 조용한 삶을 살고 있지만, 여름 방학 동안 올리버를 만나면서 그의 일상은 서서히 변화하기 시작한다. 처음에는 올리버에게 낯섦과 경계심을 느끼지만, 시간이 흐를수록 그들은 서로에게 깊은 감정을 느끼게 된다. 그 감정은 삶에 대한 새로운 통찰과 함께 서로에게 변화를 가져다준다. 시간이 흐를수록 그는 모든 것을 올리버에게 걸게 된다.',
    rating: 4.0,
    likeCount: 15,
    createdAt: '14시간 전',
  },
  {
    id: 'dr2',
    movieTitle: '박시영',
    moviePosterUrl: 'https://via.placeholder.com/100x150/2ecc71/ffffff?text=Poster2',
    title: '2025년 7/10 박스오피스',
    content: '매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)',
    rating: 3.5,
    likeCount: 10,
    createdAt: '2023.09.01 10:00',
  },
];

const DUMMY_FAVORITE_MOVIES = [
  { id: 'fm1', title: '인터스텔라', director: '크리스토퍼 놀란', releaseDate: '2014' },
  { id: 'fm2', title: '아바타: 물의 길', director: '제임스 카메론', releaseDate: '2022' },
  { id: 'fm3', title: '스파이더맨: 노 웨이 홈', director: '존 왓츠', releaseDate: '2021' },
  { id: 'fm4', title: '기생충', director: '봉준호', releaseDate: '2019' },
  { id: 'fm5', title: '범죄도시 3', director: '이상용', releaseDate: '2023' },
];

// UserProfileSection 임시 컴포넌트
const TempUserProfileSection = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 200px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #888;
  }
  h2 {
    color: #e0e0e0;
    margin-top: 15px;
    font-size: 1.8em;
    font-weight: bold;
  }
  p {
    color: #aaa;
    font-size: 1em;
    margin-top: 5px;
  }
  button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: #888;
    font-size: 1.5em;
    cursor: pointer;
    &:hover {
      color: #e0e0e0;
    }
  }
  .tag-button {
    right: 60px;
    border: 1px solid #888;
    font-size: 0.9em;
    padding: 5px 12px;
    border-radius: 20px;
  }
`;

// ReviewPreviewSection 임시 컴포넌트
const TempReviewPreviewSection = styled.div`
  background-color: #3a3a3a;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .review-title {
    font-weight: bold;
    color: #f0f0f0;
    font-size: 1.1em;
  }
  .review-movie-title {
    color: #bbb;
    font-size: 0.9em;
  }
  .review-content {
    color: #ddd;
    font-size: 0.95em;
    white-space: pre-wrap;
  }
  .review-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #888;
  }
`;

// MoviePreviewSection 임시 컴포넌트
const TempMoviePreviewSection = styled.div`
  .movie-list-item {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr; /* 제목, 감독, 연도 */
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #444;

    &:last-child {
      border-bottom: none;
    }

    span {
      color: #ddd;
      font-size: 0.95em;
    }
  }
  .movie-list-header {
      font-weight: bold;
      color: #bbb;
      border-bottom: 2px solid #555;
      padding-bottom: 10px;
      margin-bottom: 10px;
  }
`;


// 3. MyPageMain 
const MyPageMain: React.FC = () => {
  const navigate = useNavigate();

  const userProfile = DUMMY_USER_PROFILE;
  const shortReviews = DUMMY_SHORT_REVIEWS;
  const detailReviews = DUMMY_DETAIL_REVIEWS;
  const favoriteMovies = DUMMY_FAVORITE_MOVIES;

  return (
    <MyPageContainer>
      {/* 1. 사용자 프로필 섹션 */}
      <TempUserProfileSection>
        <button onClick={() => navigate('/mypage/settings')}>⚙️</button>
        <button className="tag-button" onClick={() => navigate('/mypage/tags')}>태그</button>
        <img src={userProfile.profileImageUrl} alt="프로필 이미지" />
        <h2>{userProfile.nickname}</h2>
        <p>팔로워 {userProfile.followerCount} | 팔로잉 {userProfile.followingCount}</p>
      </TempUserProfileSection>

      {/* 2. 내가 작성한 한줄평 섹션 */}
      <SectionWrapper>
        <SectionHeader>
          <SectionTitle>내가 작성한 한줄평</SectionTitle>
          <MoreButton onClick={() => navigate('/mypage/reviews/short')}>더보기</MoreButton>
        </SectionHeader>
        <PreviewContent>
          {shortReviews && shortReviews.length > 0 ? (
            shortReviews.map((review: any) => (
              <TempReviewPreviewSection key={review.id}>
                <div className="review-movie-title">영화: {review.movieTitle}</div>
                <div className="review-content">{review.content}</div>
                <div className="review-meta">
                    <span>⭐ {review.rating}</span>
                    <span>👍 {review.likeCount}</span>
                    <span>{review.createdAt}</span>
                </div>
              </TempReviewPreviewSection>
            ))
          ) : (
            <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 3. 내가 작성한 상세 리뷰 섹션 */}
      <SectionWrapper>
        <SectionHeader>
          <SectionTitle>내가 작성한 상세 리뷰</SectionTitle>
          <MoreButton onClick={() => navigate('/mypage/reviews/detail')}>더보기</MoreButton>
        </SectionHeader>
        <PreviewContent>
          {detailReviews && detailReviews.length > 0 ? (
            detailReviews.map((review: any) => (
              <TempReviewPreviewSection key={review.id}>
                {review.moviePosterUrl && <img src={review.moviePosterUrl} alt="포스터" style={{width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', float: 'left', marginRight: '10px'}} />}
                <div className="review-title">{review.title}</div>
                <div className="review-movie-title">영화: {review.movieTitle}</div>
                <div className="review-content">{review.content.substring(0, 100)}...</div>
                <div className="review-meta">
                    <span>⭐ {review.rating}</span>
                    <span>👍 {review.likeCount}</span>
                    <span>{review.createdAt}</span>
                </div>
                <div style={{clear: 'both'}}></div>
              </TempReviewPreviewSection>
            ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 4. 내가 찜한 영화 섹션 */}
      <SectionWrapper>
        <SectionHeader>
          <SectionTitle>내가 찜한 영화</SectionTitle>
          <MoreButton onClick={() => navigate('/mypage/movies/favorite')}>더보기</MoreButton>
        </SectionHeader>
        <PreviewContent>
          {favoriteMovies && favoriteMovies.length > 0 ? (
            <TempMoviePreviewSection>
                <div className="movie-list-item movie-list-header">
                    <span>제목</span>
                    <span>감독</span>
                    <span>개봉년도</span>
                </div>
                {favoriteMovies.map((movie: any) => (
                    <div className="movie-list-item" key={movie.id}>
                        <span>{movie.title}</span>
                        <span>{movie.director}</span>
                        <span>{movie.releaseDate}</span>
                    </div>
                ))}
            </TempMoviePreviewSection>
          ) : (
            <EmptyState>찜한 영화가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>
    </MyPageContainer>
  );
};

export default MyPageMain;