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
  width: 100%;
  display: flex;
  justify-content: center;
  gap: ${(props) => (props.$ismobile ? "10px" : "20px")};
  border-bottom: 2px solid #000000;
`;

const TabList = styled.ul<StyleType>`
  display: flex;
  gap: ${(props) => (props.$ismobile ? "60px" : "280px")};
`;

const TabButton = styled.button<{ selected: boolean } & StyleType>`
  cursor: pointer;
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
  border: none;
  border-bottom: ${(props) => (props.selected ? "3px solid #000000" : "none")};
  background-color: transparent;
  padding-bottom: 2px;
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
