import { useEffect, useState, type ChangeEvent } from "react";
import { useMediaQuery } from "react-responsive";
import { styled } from "styled-components";
import logo from "../assets/img/Logo.png";
import { motion } from "framer-motion";

interface styleType {
  $ismobile: boolean;
}
interface reportProp {
  setIsModalOpen: (value: boolean) => void;
}

const ModalContainer = styled.div<styleType>`
  width: ${(props) => (props.$ismobile ? "90%" : "50%")};
  height: ${(props) => (props.$ismobile ? "85%" : "90%")};
  top: 50%;
  left: 50%;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  position: fixed;
  /* color: ${({ theme }) => theme.textColor}; */
  color: black;
  z-index: 3100;
`;

const Modal = styled(motion.div)<styleType>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$ismobile ? "100%" : "70%")};
  height: ${(props) => (props.$ismobile ? "auto" : "80%")};
  max-height: ${(props) => (props.$ismobile ? "60%" : "70%")};
  /* min-height: 80%; */
  /* height: auto; */
  justify-content: center;
  align-items: center;
  /* background-color: ${({ theme }) => theme.backgroundColor}; */
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 15px;
`;

const TitleContainer = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1rem" : "1.3rem")};
  font-weight: 600;
  /* color: ${({ theme }) => theme.textColor}; */
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;
  width: 100%;
  height: 30px;
`;

const SubText = styled.span`
  font-size: 0.8rem;
  /* color: ${({ theme }) => theme.textColor}; */
  color: black;
  margin-top: 7px;
  margin-bottom: 7px;
  margin-left: 50px;
`;

const ReportTextarea = styled.textarea`
  width: 70%;
  height: 100px;
  min-height: 5%;
  margin-left: 50px;
  margin-bottom: 30px;
`;

const GreySection = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 0px;
  background-color: #e9e9e9;
  color: black;
  display: flex;
  flex-direction: column;
`;

const WhiteSection = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 0px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
`;

const DeclarationSection = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
`;

const ReportTextContainer = styled.div`
  width: 70%;
  /* height: 100px; */
  border: 1px solid #d9d9d9;
  font-size: 0.7rem;
  padding: 10px;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  z-index: 30000;
  margin-left: 50px;
`;

const Logo = styled.img<styleType>`
  position: absolute;
  top: 0px;
  left: -35px;
  width: ${(props) => (props.$ismobile ? "80px" : "80px")};
  margin-left: ${(props) => (props.$ismobile ? "20px" : "30px")};
  cursor: pointer;
  transform: rotate(-30deg);
`;

const SelectBox = styled.select`
  width: 30%;
  margin-left: 50px;
`;
const ConfirmBtn = styled(motion.button)<{
  $ismobile: boolean;
  $isbtnpos: boolean;
}>`
  display: "flex";
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$ismobile ? "80px" : "100px")};
  height: 30px;
  margin: ${(props) => (props.$ismobile ? "30px 0px" : "0px")};
  margin-top: ${(props) => (props.$ismobile ? "30px" : "35px")};
  background-color: #fa5a8e;
  color: ${({ theme }) => theme.textColor};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    background-color: #5f5d5d;
  }
  &:hover {
    background-color: ${(props) => (props.$isbtnpos ? "#e04a78" : " #d9d9d9")};
  }
`;

const CloseBtn = styled.svg`
  position: absolute;
  width: 25px;
  top: 5px;
  right: 5px;
  fill: ${({ theme }) => theme.textColor};
  viewbox: "0 0 24 24";
  stroke-width: 2;
  stroke: currentColor;
  cursor: pointer;
`;

const AdminModal = ({ setIsModalOpen }: reportProp) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [reportProcessType, setReportProcessType] = useState("선택하세요.");

  const processType: string[] = [
    "선택하세요.",
    "욕설 / 비방",
    "음란물 / 선정적 내용",
    "폭력적 / 혐오 표현",
    "스팸 / 광고",
    "개인정보 노출",
    "허위 사실 / 잘못된 정보",
    "도배 / 중복 게시",
    "저작권 침해",
    "정치적 / 종교적 선전",
    "불법 행위 및 범죄 조장",
    "기타 운영 정책 위반",
    "혐오 표현 및 차별",
  ];

  const handleSelectBox = (option: ChangeEvent<HTMLSelectElement>) => {
    setReportProcessType(option.target.value);
    console.log(reportProcessType);
  };
  return (
    <ModalContainer $ismobile={isMobile}>
      <Modal
        $ismobile={isMobile}
        initial={{ opacity: 0, visibility: "hidden", y: -20 }}
        animate={{ opacity: 1, visibility: "visible", y: 0 }}
        exit={{ opacity: 0, visibility: "hidden", y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <CloseBtn
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </CloseBtn>

        <Logo src={logo} $ismobile={isMobile} />
        <TitleContainer $ismobile={isMobile}>사용자 신고</TitleContainer>

        <GreySection>
          <SubText>신고 사유</SubText>
          <SelectBox value={reportProcessType} onChange={handleSelectBox}>
            {processType.map((opt, idx) => (
              <option key={idx}>{opt}</option>
            ))}
          </SelectBox>
        </GreySection>
        <GreySection>
          <SubText>자세한 신고 사유를 적어주세요.</SubText>
          <ReportTextarea></ReportTextarea>
        </GreySection>

        <ConfirmBtn
          $ismobile={isMobile}
          $isbtnpos={reportProcessType !== "선택하세요."}
          disabled={reportProcessType === "선택하세요."}
          onClick={() => setIsModalOpen(false)}
          initial={{ opacity: 0, visibility: "hidden", y: -20 }}
          animate={{ opacity: 1, visibility: "visible", y: 0 }}
          exit={{ opacity: 0, visibility: "hidden", y: -20 }}
          transition={{ duration: 0.3 }}
        >
          처리 완료
        </ConfirmBtn>
      </Modal>
    </ModalContainer>
  );
};

export default AdminModal;
