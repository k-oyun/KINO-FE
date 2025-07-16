import styled from "styled-components";
import ReviewCard from "./mypage/ReviewCard";
import { useEffect, useState } from "react";

interface ReviewProps {
  isMobile: boolean;
  movieId: number;
}

interface StyleType {
  $ismobile: boolean;
}

interface Review {
  userId: string;
  nickname: string;
  image: string;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
  views: number;
  comments: number;
}

const ReviewContainer = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => (props.$ismobile ? "15px" : "30px")};
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
`;

const Review = ({ isMobile, movieId }: ReviewProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    // Fetch reviews for the movieId
    console.log(`Fetching reviews for movie ID: ${movieId}`);

    const reviewList: Review[] = [
      {
        userId: "reviewer_001",
        nickname: "MovieFan88",
        image: "https://randomuser.me/api/portraits/men/71.jpg",
        title: "감동과 스릴이 가득한 최고의 영화!",
        content:
          "처음부터 끝까지 긴장감이 넘치고, 캐릭터들의 감정선이 매우 섬세하게 그려져 있어 정말 몰입해서 봤습니다. 특히 마지막 반전은 예상하지 못해서 소름이 돋았어요. 보면 볼수록 여운이 긴 작품입니다. 추천합니다!",
        likes: 21,
        createdAt: "2025-07-15T12:10:23+09:00",
        views: 402,
        comments: 5,
      },
      {
        userId: "reviewer_002",
        nickname: "영화찐애호가",
        image: "https://randomuser.me/api/portraits/women/43.jpg",
        title: "음악과 영상미가 정말 아름답습니다",
        content:
          "이 영화는 한 장면 한 장면이 마치 그림처럼 아름다웠어요. OST도 매우 인상적이어서 영화 본 이후 계속 찾아 듣고 있네요. 스토리텔링도 섬세해서 감동을 받았습니다. 강력 추천!",
        likes: 33,
        createdAt: "2025-07-12T20:41:13+09:00",
        views: 397,
        comments: 4,
      },
      {
        userId: "reviewer_003",
        nickname: "ISP_FilmBoi",
        image: "https://randomuser.me/api/portraits/men/25.jpg",
        title: "아쉬운 점도 있지만 전반적으로 만족",
        content:
          "스토리 전개가 약간 늘어지는 부분이 있었지만 배우들의 연기력과 화면 연출이 이를 상쇄할 만큼 훌륭했습니다. 특히 주인공의 심리 변화를 따라가는 연출이 인상 깊었습니다.",
        likes: 14,
        createdAt: "2025-07-10T14:25:52+09:00",
        views: 222,
        comments: 2,
      },
      {
        userId: "reviewer_004",
        nickname: "소피아",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        title: "볼수록 새로운 디테일이 발견되는 영화",
        content:
          "두 번째로 다시 보니 처음에 놓쳤던 부분들이 보이고 인물 간의 관계도 더 깊이 이해할 수 있었어요. 내러티브가 탄탄해서 여러 번 돌려보기 좋아요.",
        likes: 19,
        createdAt: "2025-07-16T09:12:04+09:00",
        views: 331,
        comments: 3,
      },
    ];
    setReviews(reviewList);
  }, []);

  return (
    <ReviewContainer $ismobile={isMobile}>
      <ReviewCard review={} type="detail"></ReviewCard>
    </ReviewContainer>
  );
};

export default Review;
