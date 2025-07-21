import styled from "styled-components";

interface TabSelectorProps<T extends string> {
  isMobile: boolean;
  tabs: readonly { id: T; label: string }[];
  selectedTab: T;
  onChange: (selectedTab: T) => void;
}

interface StyleType {
  $ismobile: boolean;
}

const TabContainer = styled.div<StyleType>`
  display: flex;
  justify-content: center;
  border-bottom: ${({ theme }) => `1px solid #ccc`};
`;

const TabList = styled.ul<StyleType>`
  display: flex;
  gap: ${(props) => (props.$ismobile ? "30px" : "140px")};
`;

const TabButton = styled.button<{ selected: boolean } & StyleType>`
  cursor: pointer;
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
  border: none;
  border-bottom: ${({ selected, theme }) =>
    selected ? `3px solid #f73c63` : "none"};
  background-color: transparent;
  padding-bottom: 5px;
  color: ${({ theme }) => theme.textColor};
  width: ${(props) => (props.$ismobile ? "80px" : "250px")};
`;

const TabSelector = <T extends string>({
  isMobile,
  tabs,
  selectedTab,
  onChange,
}: TabSelectorProps<T>) => {
  return (
    <TabContainer $ismobile={isMobile}>
      <TabList $ismobile={isMobile}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $ismobile={isMobile}
            selected={selectedTab === tab.id}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
    </TabContainer>
  );
};

export default TabSelector;
