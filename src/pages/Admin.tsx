import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import UserList from "../components/List";

const AmdinContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fa5a8e;
  width: 16%;
  height: 100%;
`;

const SidebarBtn = styled.button<{ $selected: boolean }>`
  text-align: center;
  width: 100%;
  height: 100px;
  border: none;
  background-color: ${(props) => (props.$selected ? "#FF2E72" : "#fa5a8e")};
  color: ${({ theme }) => theme.textColor};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;

const AdminText = styled.span`
  font-size: 20px;
  margin-top: 130px;
  margin-bottom: 80px;
  font-weight: 700;
  /* color: ${({ theme }) => theme.backgroundColor}; */
`;

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 88%;
  height: 100%;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const ManagementInfoContainer = styled.div`
  display: flex;
  width: 80%;
  height: 80%;
  border: 1.5px solid #d9d9d9;
  border-radius: 1px;
`;
const Admin = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [adminName, setAdminName] = useState("권오윤");
  const [selectedOption, setSelectedOption] = useState("회원관리");

  const sideBarOption = ["회원관리", "게시글", "한줄평", "댓글"];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  //   useEffect(() => {
  //     console.log(selectedOption);
  //   }, [selectedOption]);

  return (
    <AmdinContainer>
      <Sidebar>
        <AdminText>관리자 {adminName}</AdminText>
        {sideBarOption.map((label, idx) => (
          <SidebarBtn
            key={idx}
            onClick={() => handleOptionClick(label)}
            $selected={label === selectedOption}
          >
            {label}
          </SidebarBtn>
        ))}
      </Sidebar>
      <ManagementContainer>
        <ManagementInfoContainer>
          <UserList selectedOption={selectedOption} />
        </ManagementInfoContainer>
      </ManagementContainer>
    </AmdinContainer>
  );
};

export default Admin;
