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
import ConfirmDialog from "../components/ConfirmDialog";
import axios from "axios";
import { useFormatDate } from "../hooks/useFormatDate";

type UserStatus = "정상" | "정지";

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface StyleProps {
  $ismobile: boolean;
}

interface adminProps {
  selectedOption: string;
  setIsModalOpen: (value: boolean) => void;
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

const Status = styled.span<{ $status: string; $ismobile: boolean }>`
  color: ${({ $status }) => ($status === "정상" ? "green" : "red")};
  font-weight: 700;
  font-size: ${(props) => (props.$ismobile ? "12px" : "15px")};
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

const MobileTitleTxt = styled.span`
  font-weight: 700;
  font-size: 12px;
`;

const MobileContentTxt = styled.span`
  font-size: 12px;
`;

const AdminList = ({ selectedOption, setIsModalOpen }: adminProps) => {
  const [selectedUser, setSelectedUser] = useState<number[]>([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmModalOk, setIsConfirmModalOk] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const selectAllUser = () => {
    if (selectedUser.length === users.length) {
      setSelectedUser([]);
    } else {
      setSelectedUser(users.map((user) => user.id));
    }
  };

  const selectUser = (userId: number, userStatus: string) => {
    if (userStatus !== "정지") return;
    setSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  //--버릴 코드--
  const [revokedUsers, setRevokedUsers] = useState<number[]>([]);
  const handleRevoke = (userId: number) => {
    if (!revokedUsers.includes(userId)) {
      setRevokedUsers((prev) => [...prev, userId]);
    }
  };
  //------------

  const hiddenDeleteSection = (userId: number) => (
    <TrailingActions>
      <SwipeAction onClick={() => handleRevoke(userId)} destructive={true}>
        <ManageBtn $ismobile={isMobile}>철회</ManageBtn>
      </SwipeAction>
    </TrailingActions>
  );

  const userGet = async () => {
    const res = await axios.get("http://43.203.218.183:8080/api/admin/user");
    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userGet();
        console.log(res.data);
        setUsers(res.data);
      } catch (error) {
        console.error("호출 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 12명으로 페이지네이션
  return (
    <>
      {isMobile ? (
        <MobileAdminList>
          <SwipeableList threshold={0.25} fullSwipe={false}>
            {users.map((user) => {
              const showSwipe =
                selectedOption === "회원관리" && user.role !== "정지";

              return (
                <CustomSwipeableListItem
                  key={user.id}
                  trailingActions={
                    showSwipe ? hiddenDeleteSection(user.id) : false
                  }
                >
                  <MobileContainer>
                    <MobileInfoContainer
                      onClick={() => {
                        selectedOption !== "회원관리"
                          ? setIsModalOpen(true)
                          : null;
                      }}
                    >
                      <div>
                        <MobileTitleTxt>닉네임 : </MobileTitleTxt>
                        <MobileContentTxt>{user.nickname}</MobileContentTxt>
                      </div>
                      <div>
                        <MobileTitleTxt>계정 : </MobileTitleTxt>
                        <MobileContentTxt>{user.email}</MobileContentTxt>
                      </div>
                      <div>
                        <MobileTitleTxt>회원상태 : </MobileTitleTxt>
                        {/* 정지 상태인지 어떻게 판별? */}
                        <Status $ismobile={isMobile} $status={user.role}>
                          {user.role}
                        </Status>
                      </div>
                      <div>
                        <MobileTitleTxt>가입일 : </MobileTitleTxt>
                        <MobileContentTxt>
                          {useFormatDate(user.createdAt)}
                        </MobileContentTxt>
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
                      onClick={() => {
                        setIsConfirmModalOpen(true);
                      }}
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
                    onChange={() => selectUser(user.id, user.role)}
                  />
                </Td>
                <Td>{user.nickname}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Status $ismobile={isMobile} $status={user.role}>
                    {user.role}
                  </Status>
                </Td>
                <Td>{useFormatDate(user.createdAt)}</Td>
                {selectedOption === "회원관리" ? (
                  <Td>
                    {user.role === "정지" && (
                      <ManageBtn
                        $ismobile={isMobile}
                        onClick={() => {
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        정지 철회
                      </ManageBtn>
                    )}
                  </Td>
                ) : (
                  <Td>
                    <ManageBtn
                      $ismobile={isMobile}
                      onClick={() => setIsModalOpen(true)}
                    >
                      상세정보
                    </ManageBtn>
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        title="정지 철회"
        message="OOO님을 철회하시겠습니까?"
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          setIsConfirmModalOk(true);
        }}
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        showCancel={true}
        isRedButton={true}
      />
    </>
  );
};

export default AdminList;
