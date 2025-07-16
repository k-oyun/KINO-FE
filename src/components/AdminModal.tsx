import { useEffect, useState, type ChangeEvent } from "react";
import { useMediaQuery } from "react-responsive";
import { styled } from "styled-components";
import logo from "../assets/img/Logo.png";

interface styleType {
  $ismobile: boolean;
}
interface adminProps {
  setIsModalOpen: (value: boolean) => void;
}

const ModalContainer = styled.div<styleType>`
  width: ${(props) => (props.$ismobile ? "90%" : "50%")};
  height: ${(props) => (props.$ismobile ? "85%" : "90%")};
  top: 55%;
  left: 50%;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  position: fixed;
  color: ${({ theme }) => theme.textColor};
  z-index: 3100;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundColor};
  border: 1px solid #d9d9d9;
  border-radius: 15px;
  padding-bottom: 10px;
`;

const TitleContainer = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1rem" : "1.3rem")};
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  /* background-color: ${({ theme }) => theme.backgroundColor}; */
  /* background-color: red; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;
  width: 100%;
  height: 30px;
`;

const SubText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textColor};
  margin-top: 7px;
  margin-bottom: 7px;
  margin-left: 50px;
`;

const DateText = styled.span`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.textColor};
  margin-right: 50px;
`;
const UriText = styled.a`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.textColor};
  margin-left: 50px;
  cursor: pointer;
  text-decoration: none;
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
const ConfirmBtn = styled.button<{
  $ismobile: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$ismobile ? "80px" : "100px")};
  height: 30px;
  margin: 30px 0px;
  background-color: #fa5a8e;
  color: ${({ theme }) => theme.textColor};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #e04a78;
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

const AdminModal = ({ setIsModalOpen }: adminProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [reportProcessType, setReportProcessType] = useState("");

  const [reportInfo, setReportInfo] = useState({
    reporter: "seebaby@gmail.com",
    date: "2025.06.17",
    writer: "angrySung@gmail.com",
    type: "부적절한 언어 사용",
    reportContents: "인성이 너무 터졌어요ㅜㅜ 정지 시켜주세요!",
    contents: "",
    uri: "https://www.kino.com/post/13",
  });

  useEffect(() => {
    console.log(reportProcessType);
  }, [reportProcessType]);

  const processType: string[] = [
    "처리안함",
    "1일",
    "3일",
    "5일",
    "7일",
    "30일",
    "영구정지",
  ];

  const handleSelectBox = (option: ChangeEvent<HTMLSelectElement>) => {
    setReportProcessType(option.target.value);
  };
  return (
    <ModalContainer $ismobile={isMobile}>
      <Modal>
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
        <TitleContainer $ismobile={isMobile}>신고 상세 정보</TitleContainer>
        <GreySection>
          <DeclarationSection>
            <SubText style={{ color: "black" }}>
              신고자 : {reportInfo.reporter}
            </SubText>
            <DateText>신고일 : {reportInfo.date}</DateText>
          </DeclarationSection>

          <SubText style={{ color: "black" }}>
            작성자 : {reportInfo.writer}
          </SubText>
        </GreySection>
        <WhiteSection>
          <SubText>신고 유형: {reportInfo.type}</SubText>
        </WhiteSection>
        <GreySection>
          <SubText style={{ color: "black" }}>신고 내용</SubText>
          <ReportTextContainer>{reportInfo.reportContents}</ReportTextContainer>
        </GreySection>
        <WhiteSection>
          <SubText>신고된 콘텐츠</SubText>
          <UriText>{reportInfo.uri}</UriText>
        </WhiteSection>
        <GreySection>
          <SubText>처리 방법</SubText>
          <SelectBox value={reportProcessType} onChange={handleSelectBox}>
            {processType.map((opt, idx) => (
              <option key={idx}>{opt}</option>
            ))}
          </SelectBox>
        </GreySection>
        {reportProcessType !== "" && (
          <ConfirmBtn
            $ismobile={isMobile}
            onClick={() => setIsModalOpen(false)}
          >
            처리 완료
          </ConfirmBtn>
        )}
      </Modal>
    </ModalContainer>
  );
};

export default AdminModal;
