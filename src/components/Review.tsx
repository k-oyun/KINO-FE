import styled from "styled-components";
import { useEffect, useState } from "react";
import DetailReviewCard from "./mypage/DetailReviewCard";

interface ReviewProps {
  isMobile: boolean;
  movieId: number;
}

interface StyleType {
  $ismobile: boolean;
}

interface Review {
  id: string;
  title: string;
  image: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  reviewer: Reviewer;
}

interface Reviewer {
  id: string;
  nickname: string;
  image: string;
}

const ReviewContainer = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => (props.$ismobile ? "15px" : "30px")};
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
`;

const Head = styled.div<StyleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${(props) => (props.$ismobile ? "10px" : "10px")};
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1.1em")};
  margin-bottom: ${(props) => (props.$ismobile ? "6px" : "10px")};
`;

const WriteBtn = styled.button<StyleType>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fd6782;
  color: white;
  border: none;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "6px 12px")};
  font-size: ${(props) => (props.$ismobile ? "10px" : "20px")};
  cursor: pointer;
  &:hover {
    background-color: #f73c63;
  }
`;

const Review = ({ isMobile, movieId }: ReviewProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    // Fetch reviews for the movieId
    console.log(`Fetching reviews for movie ID: ${movieId}`);

    const reviewList: Review[] = [
      {
        id: "r1",
        title: "감동 그 자체였던 엘리오",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-0UIN6BUeV3hd7redgZZha6-BXyAwCRE8Q&s",
        content:
          "영화 '엘리오'는 인물의 감정을 너무도 섬세하게 잘 묘사했어요. 중반부 이후 감정 몰입이 정말 장난 아닙니다. 보면서 울컥했어요. 영화 '엘리오'는 인물의 감정을 너무도 섬세하게 잘 묘사했어요. 중반부 이후 감정 몰입이 정말 장난 아닙니다. 보면서 울컥했어요. 영화 '엘리오'는 인물의 감정을 너무도 섬세하게 잘 묘사했어요. 중반부 이후 감정 몰입이 정말 장난 아닙니다. 보면서 울컥했어요. 영화 '엘리오'는 인물의 감정을 너무도 섬세하게 잘 묘사했어요. 중반부 이후 감정 몰입이 정말 장난 아닙니다. 보면서 울컥했어요.",
        likes: 42,
        views: 350,
        comments: 12,
        createdAt: "2025-07-16 14:35",
        reviewer: {
          id: "u001",
          nickname: "cine_lover",
          image: "https://randomuser.me/api/portraits/men/21.jpg",
        },
      },
      {
        id: "r2",
        title: "인셉션, 다시 봐도 대단하다",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-0UIN6BUeV3hd7redgZZha6-BXyAwCRE8Q&s",
        content:
          "놀란 감독의 천재성이 또 느껴졌습니다. 꿈속의 꿈이라는 개념이 이렇게 흥미진진할 수 있다니!",
        likes: 68,
        views: 510,
        comments: 23,
        createdAt: "2025-07-15 08:10",
        reviewer: {
          id: "u002",
          nickname: "film_buff",
          image: "https://randomuser.me/api/portraits/women/45.jpg",
        },
      },
      {
        id: "r3",
        title: "범죄도시3, 마동석은 믿고 보는 배우",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-0UIN6BUeV3hd7redgZZha6-BXyAwCRE8Q&s",
        content:
          "통쾌한 액션과 속 시원한 전개가 정말 좋았습니다. 관객을 시원하게 해주는 영화!",
        likes: 55,
        views: 400,
        comments: 17,
        createdAt: "2025-07-14 17:50",
        reviewer: {
          id: "u003",
          nickname: "action_junkie",
          image: "https://randomuser.me/api/portraits/men/31.jpg",
        },
      },
      {
        id: "r4",
        title: "기생충, 왜 다시 봐도 찝찝한가",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-0UIN6BUeV3hd7redgZZha6-BXyAwCRE8Q&s",
        content:
          "볼 때마다 묻어나오는 사회성과 디테일에 감탄하게 됩니다. 연기, 연출, 편집 모두 명작이에요.",
        likes: 72,
        views: 620,
        comments: 34,
        createdAt: "2025-07-13 10:00",
        reviewer: {
          id: "u004",
          nickname: "classyCritic",
          image: "https://randomuser.me/api/portraits/men/51.jpg",
        },
      },
      {
        id: "r5",
        title: "듄, 시각미의 극치",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-0UIN6BUeV3hd7redgZZha6-BXyAwCRE8Q&s",

        content:
          "전개는 조금 느리지만, 스케일과 세계관의 깊이에 놀라웠습니다. 꼭 극장에서 봐야 할 작품!",
        likes: 38,
        views: 300,
        comments: 9,
        createdAt: "2025-07-12 19:20",
        reviewer: {
          id: "u005",
          nickname: "scifi_enthusiast",
          image: "https://randomuser.me/api/portraits/women/34.jpg",
        },
      },
    ];
    setReviews(reviewList);
  }, []);

  return (
    <ReviewContainer $ismobile={isMobile}>
      <Head $ismobile={isMobile}>
        <div>리뷰가 총 {reviews.length} 개 등록되어 있어요!</div>
        <WriteBtn $ismobile={isMobile}>작성하기</WriteBtn>
      </Head>
      {reviews.map((review) => (
        <DetailReviewCard
          key={review.id}
          review={review}
          isMine={review.reviewer.id === "r1"} // 임시로 첫 번째 리뷰어가 작성한 것으로 간주
          showProfile={true}
          isMobile={isMobile}
        />
      ))}
    </ReviewContainer>
  );
};

export default Review;
