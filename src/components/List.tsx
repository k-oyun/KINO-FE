import React, { useEffect, useState } from "react";
import styled from "styled-components";

type UserStatus = "정상" | "정지";

interface User {
  id: string;
  nickname: string;
  email: string;
  status: UserStatus;
  joinDate: string;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 1px solid #d9d9d9;
  /* padding: 10px; */
  height: 45px;
  /* background-color: red; */
`;

const Td = styled.td`
  border-bottom: 1px solid #eee;
  height: 30px;
  text-align: center;
`;

const Status = styled.span<{ $status: "정상" | "정지" }>`
  color: ${({ $status }) => ($status === "정상" ? "green" : "red")};
`;

const UnBanBtn = styled.button`
  background-color: #f06292;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  border: none;
  border-radius: 4px;
  width: 100px;
  height: 30px;
  cursor: pointer;

  &:disabled {
    background-color: #5f5d5d;
    cursor: not-allowed;
  }
`;

const CheckBox = styled.input`
  margin-left: 20px;
`;

const UserList = ({ selectedOption }: string) => {
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
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

  const selectUser = (userId: string) => {
    setSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);
  return (
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
                <UnBanBtn disabled={selectedUser.length === 0 ? true : false}>
                  정지 철회
                </UnBanBtn>
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
                onChange={() => selectUser(user.id)}
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
                {user.status === "정지" && <UnBanBtn>정지 철회</UnBanBtn>}
              </Td>
            ) : (
              <Td>
                <UnBanBtn>상세정보</UnBanBtn>
              </Td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserList;
