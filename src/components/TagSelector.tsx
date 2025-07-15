import { styled } from "styled-components";

interface TagSelectorProps {
  isMobile: boolean;
  tags: { id: number; name: string }[];
  selectedTags: number[];
  onChange: (selectedTags: number[]) => void;
}

interface styleType {
  $ismobile: boolean;
}

const TagContainer = styled.div<styleType>`
  width: 100%;
  overflow-x: ${(props) => (props.$ismobile ? "auto" : "visible")};
  /* 모바일에서 가로 스크롤 시 스크롤바 안보이게 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const GenreList = styled.ul<styleType>`
  list-style-type: none;
  margin: ${(props) => (props.$ismobile ? "5px 10px 0px 13px" : "0")};
  display: flex;
  flex-wrap: ${(props) => (props.$ismobile ? "nowrap" : "wrap")};
  justify-content: ${(props) => (props.$ismobile ? "flex-start" : "center")};
`;

const GenreTag = styled.button<{ selected: boolean } & styleType>`
  margin: ${(props) => (props.$ismobile ? "0px 4px" : "5px")};
  padding: ${(props) => (props.$ismobile ? "4px 10px" : "10px 20px")};
  width: ${(props) => (props.$ismobile ? "auto" : "150px")};
  font-size: ${(props) => (props.$ismobile ? "16px" : "20px")};
  flex-shrink: 0;
  color: #333;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#FE5890" : "#d9d9d9")};
  border: none;
  border-radius: 25px;
  transition: transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
    box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1), background-color 0.3s;
  &:hover {
    transform: scale(1.07) translateY(-2px);
    background-color: ${({ selected }) => (selected ? "#FE5890" : "#f73c63")};
    box-shadow: 0 8px 24px rgba(255, 124, 163, 0.18);
  }
`;

const TagSelector = ({
  isMobile,
  tags,
  selectedTags,
  onChange,
}: TagSelectorProps) => {
  return (
    <TagContainer $ismobile={isMobile}>
      <GenreList $ismobile={isMobile}>
        {tags.map((tag) => (
          <GenreTag
            $ismobile={isMobile}
            key={tag.id}
            selected={selectedTags.includes(tag.id)}
            onClick={() =>
              onChange(
                selectedTags.includes(tag.id)
                  ? selectedTags.filter((id) => id !== tag.id)
                  : [...selectedTags, tag.id]
              )
            }
          >
            # {tag.name}
          </GenreTag>
        ))}
      </GenreList>
    </TagContainer>
  );
};

export default TagSelector;
