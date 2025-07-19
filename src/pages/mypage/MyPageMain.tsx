import React, { useState, useEffect } from "react"; // useEffect 임포트
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트

import UserProfileSection from "../../components/mypage/UserProfileSection";
import ShortReviewCard from "../../components/mypage/ReviewCard";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import MovieCard from "../../components/mypage/MovieCard";

import useMypageApi from "../../api/mypage";

// --- 백엔드 API의 '새로운' 응답 구조에 맞는 타입 정의 ---
interface ApiShortReview {
  shortReviewId: number;
  content: string;
  movieTitle: string;
  createdAt: string;
  rating: number; // 이제 필수로 가정
  likes: number; // 이제 필수로 가정
}

interface ApiDetailReview {
  reviewId: number;
  title: string;
  content: string;
  movieTitle: string;
  createdAt: string;
  // image: string; // 이제 필수로 가정
  likes: number; // 이제 필수로 가정
  views: number; // 이제 필수로 가정
  comments: number; // 이제 필수로 가정
}

interface ApiMyPickMovie {
  myPickId: number;
  movieTitle: string;
  posterUrl: string;
  director: string; // 이제 필수로 가정
  releaseDate: string; // 이제 필수로 가정
}

interface MyPageMainApiResponseData {
  nickname: string;
  image: string;
  ShortReviews: ApiShortReview[]; // 배열로 변경!
  DetailReviews: ApiDetailReview[]; // 배열로 변경!
  followers: number;
  following: number;
  myPickMoives: ApiMyPickMovie[];
}

interface MyPageMainApiRespons {
  status: number;
  success: boolean;
  message: string;
  data: MyPageMainApiResponseData;
}

// --- 컴포넌트들이 사용하는 타입 정의 (변경 없음, 이대로 사용) ---
interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface Follow {
  follower: number;
  following: number;
}

interface ShortReviewType {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
  // viewCount: number;
}

interface DetailReviewType {
  id: string;
  title: string;
  // image: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  reviewer?: {
    id: string;
    nickname: string;
    // image: string;
  };
}

interface FavoriteMovieType {
  myPickId: string;
  movieTitle: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}

// --- 스타일 컴포넌트들은 변경 없음 ---
const MyPageContainer = styled.div`...`;
const SectionWrapper = styled.section`...`;
const SectionHeader = styled.div`...`;
const SectionTitle = styled.h3`...`;
const SortOptions = styled.div`...`;
const SortButton = styled.button<{ isActive: boolean }>`...`;
const PreviewContent = styled.div`...`;
const EmptyState = styled.div`...`;
const MovieCardGrid = styled.div`...`;
const PinkText = styled.span`...`;

const MyPageMain: React.FC = () => {
  const navigate = useNavigate();

  // API 데이터를 저장할 상태 변수들 (배열로 변경)
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]); // 배열로 변경
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]); // 배열로 변경
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 정렬 기준 상태 다시 활성화
  const [shortReviewSort, setShortReviewSort] = useState<
    "latest" | "views" | "likes" | "rating"
  >("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<
    "latest" | "views" | "likes"
  >("latest");

  useEffect(() => {
    const fetchMyPageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<MyPageMainApiRespons>(
          "http://43.203.218.183:8080/api/mypage/main"
        );
        const apiData = response.data.data;

        // 1. 유저 프로필 데이터 매핑
        setUserProfile({
          nickname: apiData.nickname,
          profileImageUrl: apiData.image,
          followerCount: apiData.followers,
          followingCount: apiData.following,
        });

        // 2. 한줄평 데이터 매핑 (이제 배열이므로 map 사용)
        setShortReviews(
          apiData.ShortReviews.map((review) => ({
            id: review.shortReviewId.toString(),
            movieTitle: review.movieTitle,
            content: review.content,
            rating: review.rating,
            likes: review.likes,
            createdAt: review.createdAt,
            // viewCount: review.viewCount,
          }))
        );

        // 3. 상세 리뷰 데이터 매핑 (이제 배열이므로 map 사용)
        setDetailReviews(
          apiData.DetailReviews.map((review) => ({
            id: review.reviewId.toString(),
            title: review.title,
            // image: review.image,
            content: review.content,
            likes: review.likes,
            views: review.views,
            comments: review.comments,
            createdAt: review.createdAt,
            // reviewer는 백엔드 응답에 없다면 여기에 포함시키지 않거나 undefined로 둠
            // reviewer: review.reviewer, // 만약 백엔드에서 제공한다면
          }))
        );

        // 4. 찜한 영화 데이터 매핑 (myPickMoives는 이미 배열이었고 필드 추가)
        setFavoriteMovies(
          apiData.myPickMoives.map((movie) => ({
            id: movie.myPickId.toString(),
            title: movie.movieTitle,
            posterUrl: movie.posterUrl,
            director: movie.director,
            releaseDate: movie.releaseDate,
          }))
        );
      } catch (err) {
        console.error("마이페이지 메인 데이터 불러오기 실패:", err);
        setError(
          "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyPageData();
  }, []);

  // 정렬 로직 다시 활성화 (shortReviews, detailReviews가 배열이므로)
  const sortedShortReviews = [...shortReviews].sort((a, b) => {
    if (shortReviewSort === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (shortReviewSort === "likes") {
      return b.likes - a.likes;
    } else if (shortReviewSort === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const sortedDetailReviews = [...detailReviews].sort((a, b) => {
    if (detailReviewSort === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (detailReviewSort === "views") {
      return a.views - b.views; // 조회순은 오름차순
    } else if (detailReviewSort === "likes") {
      return b.likes - a.likes;
    }
    return 0;
  });

  if (isLoading) {
    return <EmptyState>데이터를 불러오는 중입니다...</EmptyState>;
  }

  if (error) {
    return <EmptyState style={{ color: "red" }}>{error}</EmptyState>;
  }

  return (
    <MyPageContainer>
      {userProfile && <UserProfileSection userProfile={userProfile} />}

      <SectionWrapper style={{ gridArea: "shortReview" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/reviews/short")}>
            내가 작성한<PinkText>한줄평</PinkText>
            <svg /* ... */ />
          </SectionTitle>
          <SortOptions>
            <SortButton
              isActive={shortReviewSort === "latest"}
              onClick={() => setShortReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "views"}
              onClick={() => setShortReviewSort("views")}
            >
              조회순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "likes"}
              onClick={() => setShortReviewSort("likes")}
            >
              좋아요순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "rating"}
              onClick={() => setShortReviewSort("rating")}
            >
              별점순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedShortReviews.length > 0 ? (
            sortedShortReviews
              .slice(0, 3) // 3개만 미리보기
              .map((review: ShortReviewType) => (
                <ReviewCard key={review.id} review={review} type="short" />
              ))
          ) : (
            <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: "detailReview" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/reviews/detail")}>
            내가 작성한<PinkText>상세 리뷰</PinkText>
            <svg /* ... */ />
          </SectionTitle>
          <SortOptions>
            <SortButton
              isActive={detailReviewSort === "latest"}
              onClick={() => setDetailReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "views"}
              onClick={() => setDetailReviewSort("views")}
            >
              조회순
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "likes"}
              onClick={() => setDetailReviewSort("likes")}
            >
              좋아요순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedDetailReviews.length > 0 ? (
            sortedDetailReviews
              .slice(0, 3) // 3개만 미리보기
              .map((review: DetailReviewType) => (
                <ReviewCard key={review.id} review={review} type="detail" />
              ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: "favoriteMovies" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/movies/favorite")}>
            내가<PinkText>찜한 영화</PinkText>
            <svg /* ... */ />
          </SectionTitle>
          <SortOptions>
            {/* 찜한 영화는 현재 백엔드 응답에서 정렬 옵션이 없다고 가정하고 최신순만 표시 */}
            <SortButton isActive={true} disabled={favoriteMovies.length === 0}>
              최신순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <MovieCardGrid>
          {favoriteMovies.length > 0 ? (
            favoriteMovies
              .slice(0, 12)
              .map((movie: FavoriteMovieType) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
          ) : (
            <EmptyState>찜한 영화가 없습니다.</EmptyState>
          )}
        </MovieCardGrid>
      </SectionWrapper>
    </MyPageContainer>
  );
};

export default MyPageMain;
