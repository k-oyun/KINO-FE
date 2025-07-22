import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components"; // keyframes 임포트 추가
import useMypageApi from "../../api/mypage";

// --- 스켈레톤 스타일 정의 시작 (SettingForm.tsx 내부에 직접 정의) ---
const loadingAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonBase = styled.div`
  background-color: #333; /* 어두운 배경에 어울리는 회색 */
  background-image: linear-gradient(90deg, #333 0px, #444 40px, #333 80px); /* 애니메이션을 위한 그라데이션 */
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  animation: ${loadingAnimation} 1.2s ease-in-out infinite;
  display: inline-block;
  vertical-align: middle;
`;

const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1em'};
  margin-bottom: 0.5em;
`;

const SkeletonCircle = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100px'};
  height: ${props => props.height || '100px'};
  border-radius: 50%;
`;

const SkeletonRect = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '40px'};
`;
// --- 스켈레톤 스타일 정의 끝 ---


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

interface SettingFormProps {
    initialUserProfile?: UserProfileType; // initialUserProfile을 선택적으로 변경
    follow?: Follow; // follow도 선택적으로 변경
    onProfileUpdated?: (updated: UserProfileType) => void;
}

// --- 폼 레이아웃 관련 스타일 ---
const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const FormSection = styled.div`
    /* 기본 스타일 (필요시 추가) */
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
`;

const SectionTitle = styled.h4`
    font-size: 1.2em;
    font-weight: bold;
    color: #e0e0e0;
    margin: 0; /* SectionHeader에서 간격 조절 */

    @media (max-width: 767px) {
        font-size: 1.1em;
    }
`;

// --- 입력 필드 관련 스타일 ---
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StyledInput = styled.input`
    background-color: #333;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 10px 15px;
    color: #f0f0f0;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;

    &::placeholder {
        color: #888;
    }
`;

const NicknameCharCount = styled.span`
    font-size: 0.8em;
    color: #888;
    text-align: right;
    margin-top: 5px;
`;

const CurrentNicknameDisplay = styled.span`
    font-size: 0.9em;
    color: #888;
`;

// --- 버튼 관련 스타일 ---
const UploadButton = styled.button`
    background-color: #444;
    color: #f0f0f0;
    border: 1px solid #666;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 0.9em;

    &:hover {
        background-color: #555;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SaveButton = styled.button<{ $isActivated: boolean }>`
    background-color: ${(props) =>
        props.$isActivated ? "#FE5890" : "#5f5d5d"};
    color: ${(props) => (props.$isActivated ? "black" : "white")};
    font-weight: bold;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    margin-top: 40px;
    cursor: pointer;
    font-size: 1.1em;
    width: 150px;
    align-self: center;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${(props) =>
            props.$isActivated ? "#fa5a8e" : "#5f5d5d"};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 767px) {
        width: 100px;
        padding: 10px 15px;
        font-size: 1em;
    }
`;

const CurrentImageWrapper = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 10px;
    border: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CurrentImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;


const SettingForm: React.FC<SettingFormProps> = ({
    initialUserProfile,
    onProfileUpdated,
}) => {
    const { updateProfile, userInfoGet } = useMypageApi();
    
    // initialUserProfile이 undefined일 수 있으므로 초기값 설정에 주의
    const [profileImage, setProfileImage] = useState<string>(
        initialUserProfile?.image || ''
    );
    const [nickname, setNickname] = useState<string>(
        initialUserProfile?.nickname || ''
    );
    const [file, setFile] = useState<File | null>(null); // 실제 전송할 이미지 파일

    const MAX_NICKNAME_LENGTH = 20;
    const isNicknameValid =
        nickname.length > 0 && nickname.length <= MAX_NICKNAME_LENGTH;
    
    // initialUserProfile이 존재할 때만 변경 사항을 체크
    const hasChanges = initialUserProfile ? (
        profileImage !== initialUserProfile.image ||
        nickname !== initialUserProfile.nickname
    ) : false; // initialUserProfile이 없으면 변경 사항 없음으로 간주

    const canSave = hasChanges && isNicknameValid;

    // initialUserProfile이 변경될 때마다 상태 업데이트
    useEffect(() => {
        if (initialUserProfile) {
            setProfileImage(initialUserProfile.image);
            setNickname(initialUserProfile.nickname);
        }
    }, [initialUserProfile]);


    const handleProfileImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!canSave) {
            alert("변경 사항이 없습니다.");
            return;
        }

        if (!isNicknameValid) {
            alert("닉네임은 1자 이상 20자 이하로 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nickname", nickname);
            if (file) {
                formData.append("file", file);
            }

            const response = await updateProfile(formData);

            console.log("프로필 업데이트 성공:", response.data);
            alert("프로필이 성공적으로 업데이트되었습니다!");
            const res = await userInfoGet();
            const updatedProfile = res.data.data;

            setNickname(updatedProfile.nickname);
            setProfileImage(updatedProfile.image);
            setFile(null); // 파일 상태 초기화

            // 부모에게 알림
            if (onProfileUpdated) {
                onProfileUpdated(updatedProfile);
            }
        } catch (error) {
            console.error("업데이트 오류:", error);
            alert("프로필 업데이트 중 오류가 발생했습니다.");
        }
    };

    // initialUserProfile이 없을 때 스켈레톤 UI 렌더링
    if (!initialUserProfile) {
        return (
            <FormContainer onSubmit={(e) => e.preventDefault()}> {/* 스켈레톤일 때는 제출 방지 */}
                <FormSection>
                    <SectionHeader>
                        <SectionTitle><SkeletonText width="120px" height="1.2em" /></SectionTitle>
                        <UploadButton as="div" style={{ cursor: 'default' }}>
                            <SkeletonText width="80px" height="0.9em" />
                        </UploadButton>
                    </SectionHeader>
                    {/* 이미지 미리보기 스켈레톤 */}
                    <CurrentImageWrapper>
                        <SkeletonCircle width="80px" height="80px" />
                    </CurrentImageWrapper>
                </FormSection>

                <FormSection>
                    <SectionTitle><SkeletonText width="100px" height="1.2em" /></SectionTitle>
                    <InputGroup>
                        <CurrentNicknameDisplay>
                            <SkeletonText width="150px" height="0.9em" />
                        </CurrentNicknameDisplay>
                        <SkeletonRect width="100%" height="40px" /> {/* 닉네임 입력 필드 스켈레톤 */}
                        <NicknameCharCount>
                            <SkeletonText width="50px" height="0.8em" style={{ float: 'right' }} />
                        </NicknameCharCount>
                    </InputGroup>
                </FormSection>

                <SaveButton
                    type="button" // 스켈레톤일 때는 버튼 타입 변경
                    $isActivated={false}
                    disabled={true}
                >
                    <SkeletonText width="60px" height="1.1em" /> {/* 변경 버튼 스켈레톤 */}
                </SaveButton>
            </FormContainer>
        );
    }

    // initialUserProfile 데이터가 로드되면 실제 UI 렌더링
    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormSection>
                <SectionHeader>
                    <SectionTitle>프로필 변경</SectionTitle>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profileImageUpload"
                        onChange={handleProfileImageUpload}
                    />
                    <UploadButton as="label" htmlFor="profileImageUpload">
                        파일 올리기
                    </UploadButton>
                </SectionHeader>
                {/* 현재 프로필 이미지 미리보기 */}
                <CurrentImageWrapper>
                    <CurrentImage src={profileImage} alt="현재 프로필 이미지" />
                </CurrentImageWrapper>
            </FormSection>

            <FormSection>
                <SectionTitle>닉네임 변경</SectionTitle>
                <InputGroup>
                    <CurrentNicknameDisplay>
                        {initialUserProfile.nickname}
                    </CurrentNicknameDisplay>
                    <StyledInput
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="새 닉네임을 입력하세요"
                        maxLength={MAX_NICKNAME_LENGTH}
                    />
                    <NicknameCharCount>
                        {nickname.length}/{MAX_NICKNAME_LENGTH}
                    </NicknameCharCount>
                </InputGroup>
            </FormSection>

            <SaveButton
                type="submit"
                $isActivated={canSave}
                disabled={!canSave}
            >
                변경
            </SaveButton>
        </FormContainer>
    );
};

export default SettingForm;