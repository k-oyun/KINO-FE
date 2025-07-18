// src/components/mypage/SettingForm.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // axios 에러 처리를 위해 임포트
import useMyPageApi from '../../api/useMyPageApi'; // ⭐ useMyPageApi 훅 임포트

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number; // 현재 폼에서는 직접 사용하지 않지만, 타입 일관성을 위해 유지
  followingCount: number; // 현재 폼에서는 직접 사용하지 않지만, 타입 일관성을 위해 유지
}

interface SettingFormProps {
  initialUserProfile: UserProfileType;
  // ⭐ 부모 컴포넌트(MySettingsPage)로 업데이트된 프로필을 전달하는 콜백 함수 추가
  onProfileUpdate: (updatedProfile: UserProfileType) => void;
}

// --- 폼 레이아웃 관련 스타일 ---
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%; /* 폼 컨테이너가 부모 너비에 맞도록 */
  align-items: center; /* 내부 요소들을 가운데 정렬 */
  gap: 30px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%; /* 폼 요소의 너비 조정 */
  max-width: 400px; /* 최대 너비 설정 */

  @media (max-width: 767px) {
    width: 95%; /* 모바일에서 더 넓게 */
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%; /* SectionHeader가 FormSection 너비에 맞도록 */

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
  width: 100%; /* InputGroup이 FormSection 너비에 맞도록 */
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
  
  /* 파일 인풋 스타일 조정 */
  &[type="file"] {
    padding: 5px; /* 파일 인풋은 패딩을 약간 줄임 */
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
  margin-bottom: 5px; /* 입력 필드와의 간격 추가 */
`;

// --- 버튼 관련 스타일 ---
const UploadButton = styled.label` /* button 대신 label로 변경하여 input과 연결 */
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
  display: inline-block; /* label의 기본 display를 inline-block으로 */

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
  margin-top: 10px; /* 이미지 미리보기와 제목 사이 간격 */
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
  // ⭐ useMyPageApi 훅에서 프로필 업데이트 함수를 가져옵니다.
  const { updateProfileWithImage } = useMyPageApi();

  // 상태 관리:
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // 사용자가 선택한 파일 객체
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState<string>(initialUserProfile.profileImageUrl); // 현재 표시될 이미지 URL (미리보기 포함)
  const [nickname, setNickname] = useState<string>(initialUserProfile.nickname); // 닉네임
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태

  const MAX_NICKNAME_LENGTH = 20;

  // initialUserProfile이 변경될 때 (MySettingsPage에서 새로운 프로필 데이터를 받았을 때)
  // 폼의 상태를 초기화합니다.
  useEffect(() => {
    setNickname(initialUserProfile.nickname);
    setCurrentProfileImageUrl(initialUserProfile.profileImageUrl);
    setProfileImageFile(null); // 파일 선택 상태도 초기화
  }, [initialUserProfile]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file); // 파일 객체 저장
      setCurrentProfileImageUrl(URL.createObjectURL(file)); // 미리보기 URL 생성 및 설정
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 저장 버튼 활성화 여부 로직
  // 닉네임이 변경되었거나, 프로필 이미지 파일이 새로 선택되었을 때 활성화
  const hasChanges = (nickname !== initialUserProfile.nickname) || (profileImageFile !== null);
  const isNicknameValid = nickname.length > 0 && nickname.length <= MAX_NICKNAME_LENGTH;
  const canSave = hasChanges && isNicknameValid && !isSaving; // 저장 중일 때는 비활성화

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    if (!canSave) {
      if (!isNicknameValid) {
        alert('닉네임은 1자 이상 20자 이하로 입력해주세요.');
      } else {
        alert('변경 사항이 없거나 유효하지 않습니다.');
      }
      return;
    }

    setIsSaving(true); // 저장 시작

    const formData = new FormData();
    formData.append('nickname', nickname); // 닉네임 추가 (API 문서 참조)

    if (profileImageFile) {
      formData.append('file', profileImageFile); // 파일이 선택되었다면 파일 추가 (API 문서 참조)
    } else {
      // 이미지 파일이 선택되지 않은 경우:
      // 백엔드 API가 `file` 필드 없이 `nickname`만 받아도 기존 이미지를 유지하는지 확인 필요.
      // 만약 `file` 필드가 항상 필수라면, 백엔드와 논의하여 API 변경을 요청하거나,
      // 기존 이미지를 나타내는 더미 파일을 생성하여 보내는 복잡한 로직이 필요할 수 있습니다.
      // 현재는 파일이 없으면 `file` 필드를 보내지 않습니다.
    }

    try {
      // ⭐ useMyPageApi 훅의 updateProfileWithImage 함수 호출
      const responseData = await updateProfileWithImage(formData);

      alert('프로필이 성공적으로 업데이트되었습니다!');

      // 백엔드 응답에서 업데이트된 이미지 URL이 있다면 그것을 사용하고, 없다면 현재 미리보기 URL (새로 업로드된 파일의 URL) 사용
      // image_24e1c3.png에 따르면 data는 현재 비어있는 객체이므로, 백엔드에서 이미지 URL을 반환하도록 해야합니다.
      // 만약 백엔드가 업데이트된 URL을 주지 않는다면, `currentProfileImageUrl` (즉, `URL.createObjectURL`로 생성된 임시 URL)을 계속 사용하거나,
      // `initialUserProfile.profileImageUrl` (원래 URL)을 사용하고 `/mypage/main`을 다시 호출하여 최신 데이터를 가져오는 방법도 고려할 수 있습니다.
      const newProfileImageUrl = (responseData && responseData.profileImageUrl) // assuming responseData has profileImageUrl
                                 ? responseData.profileImageUrl
                                 : currentProfileImageUrl;

      // 부모 컴포넌트 (MySettingsPage)의 프로필 상태를 업데이트합니다.
      onProfileUpdate({
        ...initialUserProfile, // 팔로워/팔로잉 수는 변경되지 않으므로 그대로 유지
        nickname: nickname,
        profileImageUrl: newProfileImageUrl,
      });

      setProfileImageFile(null); // 파일 선택 상태 초기화
      // URL.revokeObjectURL(currentProfileImageUrl); // 불필요한 객체 URL 해제 (필요시)
    } catch (error: any) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        alert(`프로필 업데이트 실패: ${error.response?.data?.message || error.message || '서버 응답 없음'}`);
      } else {
        alert('프로필 업데이트 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSaving(false); // 저장 종료
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
            style={{ display: 'none' }} // 실제 input은 숨기고
            id="profileImageUpload"
            onChange={handleProfileImageChange}
          />
          <UploadButton htmlFor="profileImageUpload" disabled={isSaving}> {/* label을 버튼처럼 사용 */}
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