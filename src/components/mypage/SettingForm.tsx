import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import useMyPageApi from '../../api/useMyPageApi';

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

interface SettingFormProps {
  initialUserProfile: UserProfileType;
  onProfileUpdate: (updatedProfile: UserProfileType) => void;
}

// --- 폼 레이아웃 관련 스타일 ---
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%; 
  align-items: center;
  gap: 30px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 400px;

  @media (max-width: 767px) {
    width: 95%;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;

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

// --- 입력 필드 관련 스타일 ---
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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
  
  &[type="file"] {
    padding: 5px;
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
  margin-bottom: 5px;
`;

// --- 버튼 관련 스타일 ---
const UploadButton = styled.label`
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
  display: inline-block;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button<{ $isActivated: boolean }>`
  background-color: ${(props) => (props.$isActivated ? "#FE5890" : "#5f5d5d")};
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
    background-color: ${(props) => (props.$isActivated ? "#fa5a8e" : "#5f5d5d")};
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

// --- 프로필 이미지 미리보기 관련 스타일 ---
const ProfileImagePreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-top: 10px;
`;

const ProfileImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #FE5890;
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


// --- SettingForm 컴포넌트 ---
const SettingForm: React.FC<SettingFormProps> = ({ initialUserProfile, onProfileUpdate }) => {
  const { updateProfileWithImage } = useMyPageApi();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); 
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState<string>(initialUserProfile.profileImageUrl);
  const [nickname, setNickname] = useState<string>(initialUserProfile.nickname);
  const [isSaving, setIsSaving] = useState(false);

  const MAX_NICKNAME_LENGTH = 20;

  useEffect(() => {
    setNickname(initialUserProfile.nickname);
    setCurrentProfileImageUrl(initialUserProfile.profileImageUrl);
    setProfileImageFile(null);
  }, [initialUserProfile]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setCurrentProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const hasChanges = (nickname !== initialUserProfile.nickname) || (profileImageFile !== null);
  const isNicknameValid = nickname.length > 0 && nickname.length <= MAX_NICKNAME_LENGTH;
  const canSave = hasChanges && isNicknameValid && !isSaving; 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSave) {
      if (!isNicknameValid) {
        alert('닉네임은 1자 이상 20자 이하로 입력해주세요.');
      } else {
        alert('변경 사항이 없거나 유효하지 않습니다.');
      }
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('nickname', nickname);

    if (profileImageFile) {
      formData.append('file', profileImageFile);
    } else { /* empty */ }

    try {
      const responseData = await updateProfileWithImage(formData);

      alert('프로필이 성공적으로 업데이트되었습니다!');

      const newProfileImageUrl = (responseData && responseData.profileImageUrl)
                                 ? responseData.profileImageUrl
                                 : currentProfileImageUrl;

      onProfileUpdate({
        ...initialUserProfile,
        nickname: nickname,
        profileImageUrl: newProfileImageUrl,
      });

      setProfileImageFile(null);
    } catch (error: any) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        alert(`프로필 업데이트 실패: ${error.response?.data?.message || error.message || '서버 응답 없음'}`);
      } else {
        alert('프로필 업데이트 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormSection>
        <SectionHeader>
          <SectionTitle>프로필 이미지 변경</SectionTitle>
        </SectionHeader>
        <ProfileImagePreviewContainer>
          <ProfileImageWrapper>
            <ProfileImage src={currentProfileImageUrl} alt="프로필 이미지 미리보기" />
          </ProfileImageWrapper>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="profileImageUpload"
            onChange={handleProfileImageChange}
          />
          <UploadButton htmlFor="profileImageUpload" disabled={isSaving}>
            파일 올리기
          </UploadButton>
        </ProfileImagePreviewContainer>
      </FormSection>

      <FormSection>
        <SectionTitle>닉네임 변경</SectionTitle>
        <InputGroup>
          <CurrentNicknameDisplay>현재 닉네임: {initialUserProfile.nickname}</CurrentNicknameDisplay>
          <StyledInput
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="새 닉네임을 입력하세요"
            maxLength={MAX_NICKNAME_LENGTH}
            disabled={isSaving}
          />
          <NicknameCharCount>
            {nickname.length}/{MAX_NICKNAME_LENGTH}
          </NicknameCharCount>
        </InputGroup>
      </FormSection>

      <SaveButton type="submit" $isActivated={canSave} disabled={!canSave}>
        {isSaving ? '저장 중...' : '변경'}
      </SaveButton>
    </FormContainer>
  );
};

export default SettingForm;