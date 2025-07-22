import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/** 행에 표시할 사용자 정보 */
export interface UserListItemUser {
  userId: string;
  nickname: string;
  profileImageUrl: string;
  follow?: boolean; // 서버에서 온 실제 상태(선택)
}

/** 리스트 아이템용 Prop */
export interface UserListItemProps {
  user: UserListItemUser;
  /**
   * 팔로우/언팔로우 토글 콜백.
   * parent에서 API 호출 후 상태 업데이트.
   * userId, 현재 팔로잉 여부, 닉네임 전달.
   */
  onFollowToggle?: (
    userId: string,
    isCurrentlyFollowing: boolean,
    nickname: string
  ) => Promise<void>;

  /**
   * 리스트 컨텍스트(선택). 지정 안 하면 'searchResult' 취급.
   * - 'follower': 나를 팔로우하는 사람
   * - 'following': 내가 팔로우하는 사람
   * - 'searchResult': 검색결과 등 중립 상태
   */
  type?: "follower" | "following" | "searchResult";

  /**
   * 이 행이 로그인한 '나' 자신인가? (true면 버튼 숨김)
   */
  isMyAccount?: boolean;

  /**
   * 부모가 강제 버튼 표시/숨김을 제어할 때 사용.
   * 전달되지 않으면 type/onFollowToggle/isMyAccount 로 계산.
   */
  showFollowButton?: boolean;
}

// ------------------------------------------------------------------
// styled-components
// ------------------------------------------------------------------
const UserItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2a2a2a;
  }

  @media (max-width: 767px) {
    padding: 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const Nickname = styled.span`
  font-size: 1.1em;
  font-weight: bold;
  color: #f0f0f0;

  @media (max-width: 767px) {
    font-size: 1em;
  }
`;

const FollowButton = styled.button<{ $isFollowing: boolean }>`
  background-color: ${(props) => (props.$isFollowing ? "#555" : "#ff69b4")};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.$isFollowing ? "#777" : "#e0509a")};
  }

  @media (max-width: 767px) {
    padding: 6px 12px;
    font-size: 0.8em;
  }
`;

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onFollowToggle,
  type = "searchResult",
  isMyAccount,
  showFollowButton,
}) => {
  const navigate = useNavigate();
  console.log("isMyAccount: ", isMyAccount);
  console.log("showFollowButton", showFollowButton);

  // 실제 팔로잉 상태: 서버 값 우선, 없으면 type 추론
  const currentIsFollowingStatus =
    user.follow !== undefined ? user.follow : type === "following";

  const handleUserClick = () => {
    navigate(`/mypage/${user.userId}`);
  };

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // row 클릭 이동 막기
    if (onFollowToggle) {
      onFollowToggle(user.userId, currentIsFollowingStatus, user.nickname);
    }
  };

  // 버튼 표시 여부 계산
  const computedShouldShowFollowButton = (() => {
    // 강제 지정이 최우선
    if (typeof showFollowButton === "boolean") return showFollowButton;
    // '나'면 숨김
    if (isMyAccount) return false;
    // 토글 핸들러 없으면 표시 의미 없음
    if (!onFollowToggle) return false;
    // 기본: 지정된 type에 따라 표시
    return (
      type === "follower" || type === "following" || type === "searchResult"
    );
  })();

  const imgSrc =
    user.profileImageUrl ||
    `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${encodeURIComponent(
      user.nickname.substring(0, 1)
    )}`;

  return (
    <UserItemContainer>
      <UserInfo onClick={handleUserClick}>
        <ProfileImage src={imgSrc} alt={user.nickname} />
        <Nickname>{user.nickname}</Nickname>
      </UserInfo>

      {computedShouldShowFollowButton && (
        <FollowButton
          $isFollowing={currentIsFollowingStatus}
          onClick={handleFollowButtonClick}
        >
          {currentIsFollowingStatus ? "팔로잉" : "팔로우"}
        </FollowButton>
      )}
    </UserItemContainer>
  );
};

export default UserListItem;
