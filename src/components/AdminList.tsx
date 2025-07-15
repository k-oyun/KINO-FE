import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

type UserStatus = "정상" | "정지";

interface User {
  id: string;
  nickname: string;
  email: string;
  status: UserStatus;
  joinDate: string;
}

interface SelectedProps {
  selectedOption: string;
}

interface StyleProps {
  $ismobile: boolean;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 1px solid #d9d9d9;
  height: 45px;
`;

const Td = styled.td`
  border-bottom: 1px solid #eee;
  height: 30px;
  text-align: center;
`;

const Status = styled.span<{ $status: "정상" | "정지" }>`
  color: ${({ $status }) => ($status === "정상" ? "green" : "red")};
  font-weight: 700;
`;

const ManageBtn = styled.button<StyleProps>`
  background-color: ${(props) => (props.$ismobile ? "red" : "#f06292")};
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  border: none;
  border-radius: 4px;
  width: ${(props) => (props.$ismobile ? "70px" : "100px")};
  height: ${(props) => (props.$ismobile ? "100%" : "30px")};
  cursor: pointer;
  white-space: nowrap;
  &:disabled {
    background-color: #5f5d5d;
    cursor: not-allowed;
  }
`;

const CheckBox = styled.input`
  margin-left: 20px;
`;

const MobileAdminList = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  padding: 8px;
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 300px;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const MobileInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CustomSwipeableListItem = styled(SwipeableListItem)`
  margin-top: 15px;
`;

const UserList = ({ selectedOption }: SelectedProps) => {
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const users: User[] = [
    {
      id: "1",
      nickname: "박시영",
      email: "seebaby@gmail.com",
      status: "정지",
      joinDate: "2025.04.28",
    },
    {
      id: "2",
      nickname: "성현주",
      email: "angrySeong@gmail.com",
      status: "정상",
      joinDate: "2025.04.24",
    },
    {
      id: "3",
      nickname: "이지수",
      email: "frontGod@gmail.com",
      status: "정상",
      joinDate: "2025.04.25",
    },
    {
      id: "4",
      nickname: "박지원",
      email: "BackGod@gmail.com",
      status: "정상",
      joinDate: "2025.04.25",
    },
    {
      id: "5",
      nickname: "정상기",
      email: "BackMaster@gmail.com",
      status: "정지",
      joinDate: "2025.04.23",
    },
    {
      id: "6",
      nickname: "권오윤",
      email: "chocopie@gmail.com",
      status: "정상",
      joinDate: "2025.04.24",
    },
    {
      id: "7",
      nickname: "초코파이 사육사",
      email: "chocopieMaster@gmail.com",
      status: "정지",
      joinDate: "2025.04.24",
    },
    {
      id: "8",
      nickname: "드럼통즈",
      email: "drumTongs@gmail.com",
      status: "정지",
      joinDate: "2025.04.24",
    },
    {
      id: "9",
      nickname: "멕시칸",
      email: "Mexican@gmail.com",
      status: "정상",
      joinDate: "2025.04.24",
    },
    {
      id: "10",
      nickname: "더푸드",
      email: "theFood@naver.com",
      status: "정지",
      joinDate: "2025.04.24",
    },
    {
      id: "11",
      nickname: "ms.0",
      email: "master@gmail.com",
      status: "정지",
      joinDate: "2025.04.24",
    },
    {
      id: "12",
      nickname: "짱구",
      email: "jjanggu@gmail.com",
      status: "정상",
      joinDate: "2025.04.24",
    },
  ];

  const selectAllUser = () => {
    if (selectedUser.length === users.length) {
      setSelectedUser([]);
    } else {
      setSelectedUser(users.map((user) => user.id));
    }
  };

  const selectUser = (userId: string, userStatus: string) => {
    if (userStatus !== "정지") return;
    setSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  //--버릴 코드--
  const [revokedUsers, setRevokedUsers] = useState<string[]>([]);
  const handleRevoke = (userId: string) => {
    if (!revokedUsers.includes(userId)) {
      setRevokedUsers((prev) => [...prev, userId]);
    }
  };
  //------------

  const hiddenDeleteSection = (userId: string) => (
    <TrailingActions>
      <SwipeAction onClick={() => handleRevoke(userId)} destructive={true}>
        <ManageBtn $ismobile={isMobile}>철회</ManageBtn>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <>
      {isMobile ? (
        <MobileAdminList>
          <SwipeableList threshold={0.25} fullSwipe={false}>
            {users.map((user) => {
              const showSwipe =
                selectedOption === "회원관리" && user.status === "정지";

              return (
                <CustomSwipeableListItem
                  key={user.id}
                  trailingActions={
                    showSwipe ? hiddenDeleteSection(user.id) : false
                  }
                >
                  <MobileContainer>
                    <MobileInfoContainer>
                      <div>
                        <strong>닉네임:</strong> {user.nickname}
                      </div>
                      <div>
                        <strong>계정:</strong> {user.email}
                      </div>
                      <div>
                        <strong>회원상태:</strong>{" "}
                        <Status $status={user.status}>{user.status}</Status>
                      </div>
                      <div>
                        <strong>가입일:</strong> {user.joinDate}
                      </div>
                    </MobileInfoContainer>
                  </MobileContainer>
                </CustomSwipeableListItem>
              );
            })}
          </SwipeableList>
        </MobileAdminList>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>
                <CheckBox type="checkbox" onClick={selectAllUser} />
              </Th>
              {selectedOption === "회원관리" ? (
                <>
                  <Th>닉네임</Th>
                  <Th>계정</Th>
                  <Th>회원상태</Th>
                  <Th>가입일</Th>
                  <Th>
                    <ManageBtn
                      disabled={selectedUser.length === 0}
                      $ismobile={isMobile}
                    >
                      정지 철회
                    </ManageBtn>
                  </Th>
                </>
              ) : (
                <>
                  <Th>신고자</Th>
                  <Th>작성자</Th>
                  <Th>회원상태</Th>
                  <Th>신고일</Th>
                  <Th></Th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <Td>
                  <CheckBox
                    type="checkbox"
                    checked={selectedUser.includes(user.id)}
                    onChange={() => selectUser(user.id, user.status)}
                  />
                </Td>
                <Td>{user.nickname}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Status $status={user.status}>{user.status}</Status>
                </Td>
                <Td>{user.joinDate}</Td>
                {selectedOption === "회원관리" ? (
                  <Td>
                    {user.status === "정지" && (
                      <ManageBtn $ismobile={isMobile}>정지 철회</ManageBtn>
                    )}
                  </Td>
                ) : (
                  <Td>
                    <ManageBtn $ismobile={isMobile}>상세정보</ManageBtn>
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserList;
