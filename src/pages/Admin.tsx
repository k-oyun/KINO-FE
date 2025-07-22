import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import AdminList from "../components/admin/AdminList";
import AdminModal from "../components/admin/AdminModal";
import Pagenation from "../components/Pagenation";
import AdminChart from "../components/admin/AdminChart";
import useAdminApi from "../api/admin";
import ShortReview from "../components/ShortReview";
import { motion } from "framer-motion";

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

const Sidebar = styled(motion.div)<styleProp>`
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
`;

const ManagementInfoContainer = styled(motion.div)<styleProp>`
  display: flex;
  width: ${(props) => (props.$ismobile ? "auto" : "80%")};
  height: auto;
  min-height: 80%;
  border: ${(props) => (props.$ismobile ? "none" : "1.5px solid #d9d9d9")};
  margin-top: 40px;
  border-radius: 1px;
  align-items: flex-start;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 30px;
  width: 80%;
  height: 500px;
  margin: 0 auto;
  padding: 50px;
  border: 1px solid #d9d9d9;
  overflow: scroll;
`;

interface shortReviewType {
  genre: string;
  shortReviewCount: number;
}

interface bannedUserCountType {
  month: string;
  banCount: number;
}
const Admin = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [adminName, setAdminName] = useState("권오윤");
  const [selectedOption, setSelectedOption] = useState("회원관리");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sideBarOption = ["회원관리", "게시글", "한줄평", "댓글", "통계"];
  const [selectedReportId, setSelectedReportId] = useState(0);
  const [isConfirmBtnPrs, setIsConfirmBtnprs] = useState(false);
  const { getBanUserStats, getShortReviewStats } = useAdminApi();
  const [pageInfo, setPageInfo] = useState<PageType>({
    currentPage: 0,
    size: 12,
    pageContentAmount: 0,
  });

  const [ShortReviewStats, setShortReviewStats] = useState<shortReviewType[]>(
    []
  );

  const [bannedUserCount, setBannedUserCount] = useState<bannedUserCountType[]>(
    []
  );

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

  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 5);

  function formatDate(date: Date, isEnd = false) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = isEnd ? "23" : "00";
    const min = isEnd ? "59" : "00";
    const s = isEnd ? "59" : "00";
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
  }

  const start = formatDate(startDate);
  const end = formatDate(now, true);
  useEffect(() => {
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
    if (selectedOption === "통계") {
      const fetchStat = async () => {
        const resgetShortReviewStats = await getShortReviewStats();
        setShortReviewStats(resgetShortReviewStats.data.data);
        const resBannedUserStats = await getBanUserStats(start, end);
        setBannedUserCount(resBannedUserStats.data.data);
      };
      console.log(bannedUserCount);
      fetchStat();
    }
  }, [selectedOption]);

  useEffect(() => {
    console.log(localStorage.getItem("accessToken"));
  }, []);

  return (
    <>
      <AmdinContainer $ismobile={isMobile}>
        <Sidebar
          $ismobile={isMobile}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
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
          {selectedOption !== "통계" ? (
            <>
              <ManagementInfoContainer
                $ismobile={isMobile}
                key={selectedOption}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              >
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
            </>
          ) : !isMobile ? (
            <ChartContainer>
              <AdminChart
                dataValues={ShortReviewStats}
                chartTitle="장르별 리뷰"
                chartLabel="리뷰 수"
                labelKey="genre"
                valueKey="shortReviewCount"
              />
              <AdminChart
                dataValues={bannedUserCount}
                chartTitle={"5개월 정지"}
                chartLabel={"회원 수"}
                labelKey="month"
                valueKey="banCount"
              />
            </ChartContainer>
          ) : (
            <ManagementInfoContainer $ismobile={isMobile}>
              PC에서만 사용 가능한 기능입니다.
            </ManagementInfoContainer>
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
