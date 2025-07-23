import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import UserListItem from "../../components/mypage/UserListItem";
import VideoBackground from "../../components/VideoBackground";
import useMyPageApi from "../../api/mypage";
import Pagination from "../../components/Pagenation";

export interface FollowingApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: Array<{
    userId: number;
    nickname: string;
    follow: boolean;
    profileImageUrl?: string;
  }>;
}

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface FollowingType {
  userId: string;
  nickname: string;
  profileImageUrl: string;
  follow: boolean;
}

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const ITEMS_PER_PAGE = 20;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;

  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
`;

const SectionWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  flex-grow: 1;
  overflow-y: auto;

  @media (max-width: 767px) {
    padding: 20px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #f0f0f0;
  font-size: 2em;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateX(-5px);
  }

  svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }

  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 10px;
    align-self: flex-start;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;

  @media (max-width: 767px) {
    font-size: 1.4em;
  }
  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 767px) {
    gap: 10px;
  }
`;

const EmptyState = styled.div`
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;

  @media (max-width: 767px) {
    padding: 20px 0;
    font-size: 1em;
  }
`;

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 0px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -100px) scale(0.9);
  }
`;

const PopupContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  min-width: 250px;
  text-align: center;

  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.5s
    forwards;
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: visibility 0.5s, opacity 0.5s;

  @media (max-width: 767px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 20px;
    font-size: 1em;
    min-width: unset;
    width: 90%;
  }
`;

const MyFollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const { getFollowing, followUser, unfollowUser, userInfoGet, mypageMain } =
    useMyPageApi();
  const { targetId } = useParams<{ targetId?: string }>();
  const { t } = useTranslation();

  const [following, setFollowing] = useState<FollowingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(
    null
  );
  const [viewedUserNickname, setViewedUserNickname] = useState<string>("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  const triggerPopup = useCallback(
    (message: string) => {
      setPopupMessage(message);
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    },
    []
  );

  const isOwner = useMemo(() => {
    if (!loggedInUser) return false;
    if (!targetId) return true;
    const tid = Number(targetId);
    if (Number.isNaN(tid)) return false;
    return tid === loggedInUser.userId;
  }, [loggedInUser, targetId]);

  useEffect(() => {
    const loadLoggedInUser = async () => {
      try {
        const res = await userInfoGet();
        setLoggedInUser(res.data?.data ?? null);
      } catch (err) {
        console.error(t("failedToLoadLoggedInUserInfo"), err);
        setLoggedInUser(null);
      }
    };
    loadLoggedInUser();
  }, [userInfoGet, t]);

  useEffect(() => {
    if (!loggedInUser) {
      setLoading(false);
      return;
    }
    const userIdToLoad = targetId ? Number(targetId) : loggedInUser.userId;
    const finalUid = isNaN(userIdToLoad) ? loggedInUser.userId : userIdToLoad;

    const loadFollowingAndUserName = async () => {
      setLoading(true);
      setError(null);
      try {
        const followingRes = await getFollowing(finalUid);
        const followingData: FollowingApiResponse["data"] | null =
          followingRes.data.data;

        if (followingData) {
          const mappedFollowing: FollowingType[] = followingData.map(
            (followedUser) => ({
              userId: String(followedUser.userId),
              nickname: followedUser.nickname,
              profileImageUrl:
                followedUser.profileImageUrl ||
                `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${followedUser.nickname.substring(
                  0,
                  1
                )}`,
              follow: followedUser.follow,
            })
          );
          setFollowing(mappedFollowing);
        } else {
          setFollowing([]);
        }

        if (isOwner) {
          setViewedUserNickname(loggedInUser.nickname);
        } else {
          const userProfileRes = await mypageMain(finalUid);
          setViewedUserNickname(
            userProfileRes.data?.data?.nickname || t("unknown")
          );
        }
      } catch (err) {
        console.error(t("failedToLoadFollowingDataOrUserInfo"), err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(
            new CustomEvent("unauthorized", { detail: { status: 401 } })
          );
        } else {
          setError(t("failedToLoadFollowingList"));
        }
        setFollowing([]);
        setViewedUserNickname(t("unknown"));
      } finally {
        setLoading(false);
      }
    };

    loadFollowingAndUserName();
  }, [loggedInUser, targetId, getFollowing, mypageMain, isOwner, t]);

  useEffect(() => {
    const totalPages = Math.ceil(following.length / ITEMS_PER_PAGE) || 0;
    setPageInfo((prev) => ({
      ...prev,
      currentPage: prev.currentPage >= totalPages ? 0 : prev.currentPage,
      size: ITEMS_PER_PAGE,
      pageContentAmount: totalPages,
    }));
  }, [following]);

  const currentFollowing = useMemo(() => {
    const startIdx = pageInfo.currentPage * pageInfo.size;
    const endIdx = startIdx + pageInfo.size;
    return following.slice(startIdx, endIdx);
  }, [following, pageInfo]);

  const handleFollowToggle = async (
    targetUserId: string,
    isCurrentlyFollowing: boolean,
    targetUserNickname: string
  ) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(Number(targetUserId));
        setFollowing((prevFollowing) =>
          prevFollowing.filter((user) => user.userId !== targetUserId)
        );
        triggerPopup(t("unfollowedUser", { nickname: targetUserNickname }));
      } else {
        await followUser(Number(targetUserId));
        setFollowing((prevFollowing) =>
          prevFollowing.map((u) =>
            u.userId === targetUserId ? { ...u, follow: true } : u
          )
        );
        triggerPopup(t("followedUser", { nickname: targetUserNickname }));
      }
    } catch (err) {
      console.error(t("failedToFollowUnfollow", { userId: targetUserId }), err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(
          new CustomEvent("unauthorized", { detail: { status: 401 } })
        );
      } else {
        alert(t("errorProcessingFollowUnfollow"));
      }
    }
  };

  const getBackPath = useMemo(
    () => (targetId ? `/mypage/${targetId}` : "/mypage"),
    [targetId]
  );

  const pageTitleText = useMemo(
    () =>
      loading
        ? t("following")
        : isOwner
        ? t("followingMine")
        : t("followingOf", { nickname: viewedUserNickname }),
    [isOwner, viewedUserNickname, loading, t]
  );

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate(getBackPath)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L9 12L15 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackButton>
          <PageTitle>
            {pageTitleText} <PinkText>{t("following")}</PinkText>
          </PageTitle>
        </PageHeader>
        {loading ? (
          <EmptyState>{t("loadingFollowingList")}</EmptyState>
        ) : error ? (
          <EmptyState>
            {t("errorOccurred")}: {error}
          </EmptyState>
        ) : following.length > 0 ? (
          <>
            <UserList>
              {currentFollowing.map((followedUser) => (
                <UserListItem
                  key={followedUser.userId}
                  user={followedUser}
                  onFollowToggle={handleFollowToggle}
                  showFollowButton={
                    loggedInUser?.userId !== Number(followedUser.userId)
                  }
                  isMyAccount={loggedInUser?.userId === Number(followedUser.userId)}
                  type="following"
                />
              ))}
            </UserList>

            {pageInfo.pageContentAmount > 1 && (
              <Pagination
                size={pageInfo.size}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={pageInfo.currentPage}
                pageContentAmount={pageInfo.pageContentAmount}
                setPageInfo={setPageInfo}
                pageInfo={pageInfo}
                selectedOption=""
              />
            )}
          </>
        ) : (
          <EmptyState>{t("noFollowingYet")}</EmptyState>
        )}
      </SectionWrapper>

      <PopupContainer $isVisible={showPopup}>{popupMessage}</PopupContainer>
    </PageContainer>
  );
};

export default MyFollowingPage;