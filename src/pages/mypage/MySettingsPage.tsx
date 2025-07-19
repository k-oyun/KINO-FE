import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SettingForm from "../../components/mypage/SettingForm";
import UserProfileSection from "../../components/mypage/UserProfileSection";
import useMypageApi from "../../api/mypage";
import VideoBackground from '../../components/VideoBackground';

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

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 300px;
    background-color: transparent;
    // min-height: calc(100vh - 60px);
    max-height: 100vh;
    color: #f0f0f0;

    display: flex;
    flex-direction: column;

    @media (max-width: 767px) {
        padding: 20px 15px;
        padding-top: 80px;
    }
`;

const SectionWrapper = styled.section`
    background-color: rgba(0, 0, 0, 0.7);
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    margin-bottom: 30px;

    &:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 767px) {
        padding: 20px;
    }
`;

const MySettingsPage: React.FC = () => {
    const { userInfoGet, getFollower, getFollowing } = useMypageApi();

    const [userProfile, setUserProfile] = useState<UserProfileType>();
    const [userFollow, setUserFollow] = useState<Follow>({
        follower: 0,
        following: 0,
    });

    useEffect(() => {
        const userDataGet = async () => {
            const res = await userInfoGet();
            setUserProfile(res.data.data);

            const userId = res.data.data.userId;
            if (userId) {
                console.log("userid : " + userId);
                const [followerRes, followingRes] = await Promise.all([
                    getFollower(userId),
                    getFollowing(userId),
                ]);

                const followData: Follow = {
                    follower: followerRes.data.data.length,
                    following: followingRes.data.data.length,
                };

                console.log(followerRes.data.data);
                console.log(followingRes.data.data);

                setUserFollow(followData);
            }
        };
        userDataGet();
    }, []);

    return (
        <PageContainer>
          <VideoBackground /> 
            {userProfile && userFollow ? (
                <>
                    <UserProfileSection
                        userProfile={userProfile}
                        follow={userFollow}
                    />
                    <SectionWrapper>
                        <SettingForm
                            initialUserProfile={userProfile}
                            follow={userFollow}
                            onProfileUpdated={setUserProfile}
                        />
                    </SectionWrapper>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </PageContainer>
    );
};

export default MySettingsPage;
