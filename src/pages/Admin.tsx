import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import AdminList from "../components/AdminList";
import AdminModal from "../components/AdminModal";
import Pagenation from "../components/Pagenation";

interface styleProp {
  $ismobile: boolean;
}

interface PageType {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const AmdinContainer = styled.div<styleProp>`
  display: flex;
  flex-direction: ${(props) => (props.$ismobile ? "column" : "row")};
  align-items: center;
  width: 100%;
  height: 100vh;
  /* background-color: ${({ theme }) => theme.backgroundColor}; */
  background-color: white;
  /* color: ${({ theme }) => theme.textColor}; */
  color: black;
`;

const Sidebar = styled.div<styleProp>`
  display: flex;
  flex-direction: ${(props) => (props.$ismobile ? "row" : "column")};
  align-items: center;
  background-color: ${(props) => (props.$ismobile ? "transparent" : "#fa5a8e")};
  width: ${(props) => (props.$ismobile ? "80%" : "16%")};
  height: ${(props) => (props.$ismobile ? "5%" : "100%")};
  margin-top: ${(props) => (props.$ismobile ? "100px" : "0px")};
`;

const SidebarBtn = styled.button<{ $selected: boolean; $ismobile: boolean }>`
  text-align: center;
  width: 100%;
  height: ${(props) => (props.$ismobile ? " 30px" : "100px")};
  border: none;
  background-color: ${(props) => (props.$selected ? "#FF2E72" : "#fa5a8e")};
  /* color: ${({ theme }) => theme.textColor}; */
  color: white;
  font-size: ${(props) => (props.$ismobile ? "14px" : "18px")};
  font-weight: 700;
  cursor: pointer;
`;

const AdminText = styled.span`
  font-size: 20px;
  margin-top: 130px;
  margin-bottom: 80px;
  font-weight: 700;
  /* color: ${({ theme }) => theme.backgroundColor}; */
  color: white;
`;

const ManagementContainer = styled.div<styleProp>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.$ismobile ? "none" : "center")};
  align-items: center;
  width: 88%;
  height: ${(props) => (props.$ismobile ? "auto" : "100%")};
  /* background-color: ${({ theme }) => theme.backgroundColor}; */
  background-color: white;
`;

const ManagementInfoContainer = styled.div<styleProp>`
  display: flex;
  width: ${(props) => (props.$ismobile ? "auto" : "80%")};
  height: ${(props) => (props.$ismobile ? "auto" : "80%")};
  border: ${(props) => (props.$ismobile ? "none" : "1.5px solid #d9d9d9")};
  margin-top: 40px;

  border-radius: 1px;
`;
const Admin = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [adminName, setAdminName] = useState("권오윤");
  const [selectedOption, setSelectedOption] = useState("회원관리");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sideBarOption = ["회원관리", "게시글", "한줄평", "댓글"];
  const [selectedReportId, setSelectedReportId] = useState(0);
  const [isConfirmBtnPrs, setIsConfirmBtnprs] = useState(false);

  const [pageInfo, setPageInfo] = useState<PageType>({
    currentPage: 0,
    size: 12,
    pageContentAmount: 0,
  });

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const reportTypeSend = () => {
    if (selectedOption === "게시글") {
      return "reviewdetail";
    }
    if (selectedOption === "한줄평") {
      return "shortreviewdetail";
    }
    if (selectedOption === "댓글") {
      return "commentdetail";
    }
    return "defaultType";
  };

  useEffect(() => {
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
  }, [selectedOption]);
  return (
    <>
      <AmdinContainer $ismobile={isMobile}>
        <Sidebar $ismobile={isMobile}>
          {!isMobile && <AdminText>관리자 {adminName}</AdminText>}
          {sideBarOption.map((label, idx) => (
            <SidebarBtn
              key={idx}
              onClick={() => handleOptionClick(label)}
              $ismobile={isMobile}
              $selected={label === selectedOption}
            >
              {label}
            </SidebarBtn>
          ))}
        </Sidebar>
        <ManagementContainer $ismobile={isMobile}>
          <ManagementInfoContainer $ismobile={isMobile}>
            <AdminList
              selectedOption={selectedOption}
              setIsModalOpen={setIsModalOpen}
              setSelectedReportId={setSelectedReportId}
              setIsConfirmBtnprs={setIsConfirmBtnprs}
              isConfirmBtnPrs={isConfirmBtnPrs}
              pageInfo={pageInfo}
              setPageInfo={setPageInfo}
            />
          </ManagementInfoContainer>
          {!isMobile && (
            <Pagenation
              size={pageInfo.size}
              itemsPerPage={5}
              pageContentAmount={pageInfo.pageContentAmount}
              currentPage={pageInfo.currentPage}
              setPageInfo={setPageInfo}
              pageInfo={pageInfo}
              selectedOption={selectedOption}
            />
          )}
        </ManagementContainer>
      </AmdinContainer>
      {isModalOpen && (
        <AdminModal
          setIsConfirmBtnprs={setIsConfirmBtnprs}
          setIsModalOpen={setIsModalOpen}
          reportType={reportTypeSend()}
          reportId={selectedReportId}
        />
      )}
    </>
  );
};

export default Admin;
