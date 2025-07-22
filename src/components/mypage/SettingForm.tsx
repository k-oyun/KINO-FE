import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import useMypageApi from "../../api/mypage";
import { useTranslation } from "react-i18next";

const loadingAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonBase = styled.div`
  background-color: #333;
  background-image: linear-gradient(90deg, #333 0px, #444 40px, #333 80px);
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
    initialUserProfile?: UserProfileType;
    follow?: Follow;
    onProfileUpdated?: (updated: UserProfileType) => void;
}

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
    margin: 0;

    @media (max-width: 767px) {
        font-size: 1.1em;
    }
`;

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
    const { t } = useTranslation();
    const { updateProfile, userInfoGet } = useMypageApi();

    const [profileImage, setProfileImage] = useState<string>(
        initialUserProfile?.image || ''
    );
    const [nickname, setNickname] = useState<string>(
        initialUserProfile?.nickname || ''
    );
    const [file, setFile] = useState<File | null>(null);

    const MAX_NICKNAME_LENGTH = 20;
    const isNicknameValid =
        nickname.length > 0 && nickname.length <= MAX_NICKNAME_LENGTH;

    const hasChanges = initialUserProfile ? (
        profileImage !== initialUserProfile.image ||
        nickname !== initialUserProfile.nickname
    ) : false; 

    const canSave = hasChanges && isNicknameValid;

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
            alert(t('settingForm.noChangesAlert'));
            return;
        }

        if (!isNicknameValid) {
            alert(t('settingForm.nicknameValidationAlert'));
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
            alert(t('settingForm.updateSuccessAlert'));
            const res = await userInfoGet();
            const updatedProfile = res.data.data;

            setNickname(updatedProfile.nickname);
            setProfileImage(updatedProfile.image);
            setFile(null);

            if (onProfileUpdated) {
                onProfileUpdated(updatedProfile);
            }
        } catch (error) {
            console.error("업데이트 오류:", error);
            alert(t('settingForm.updateErrorAlert'));
        }
    };

    if (!initialUserProfile) {
        return (
            <FormContainer onSubmit={(e) => e.preventDefault()}>
                <FormSection>
                    <SectionHeader>
                        <SectionTitle><SkeletonText width="120px" height="1.2em" /></SectionTitle>
                        <UploadButton as="div" style={{ cursor: 'default' }}>
                            <SkeletonText width="80px" height="0.9em" />
                        </UploadButton>
                    </SectionHeader>
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
                        <SkeletonRect width="100%" height="40px" />
                        <NicknameCharCount>
                            <SkeletonText width="50px" height="0.8em" style={{ float: 'right' }} />
                        </NicknameCharCount>
                    </InputGroup>
                </FormSection>

                <SaveButton
                    type="button" 
                    $isActivated={false}
                    disabled={true}
                >
                    <SkeletonText width="60px" height="1.1em" />
                </SaveButton>
            </FormContainer>
        );
    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormSection>
                <SectionHeader>
                    <SectionTitle>{t('settingForm.profileChangeTitle')}</SectionTitle>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profileImageUpload"
                        onChange={handleProfileImageUpload}
                    />
                    <UploadButton as="label" htmlFor="profileImageUpload">
                        {t('settingForm.uploadFileButton')}
                    </UploadButton>
                </SectionHeader>
                <CurrentImageWrapper>
                    <CurrentImage src={profileImage} alt={t('settingForm.currentProfileImageAlt')} />
                </CurrentImageWrapper>
            </FormSection>

            <FormSection>
                <SectionTitle>{t('settingForm.nicknameChangeTitle')}</SectionTitle>
                <InputGroup>
                    <CurrentNicknameDisplay>
                        {initialUserProfile.nickname}
                    </CurrentNicknameDisplay>
                    <StyledInput
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t('settingForm.newNicknamePlaceholder')}
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
                {t('settingForm.changeButton')}
            </SaveButton>
        </FormContainer>
    );
};

export default SettingForm;