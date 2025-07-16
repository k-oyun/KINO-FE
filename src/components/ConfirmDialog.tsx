import React, { useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.backgroundColor};
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2<{ $hasMessage: boolean }>`
  font-size: 18px;
  margin-bottom: ${({ $hasMessage }) => ($hasMessage ? "12px" : "0")};
`;

const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.modalTextColor};
  margin-bottom: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button<{ $backgroundColor?: string; color?: string }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background-color: ${({ $backgroundColor }) => $backgroundColor || "#eee"};
  color: ${({ color }) => color || "#333"};
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    filter: brightness(90%);
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  isRedButton?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  showCancel = true,
  onConfirm,
  onCancel,
  isRedButton = false,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={() => onCancel?.()}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title $hasMessage={!!message}>{title}</Title>
        {message && <Message>{message}</Message>}
        <ButtonWrapper>
          {showCancel && (
            <Button onClick={onCancel} $backgroundColor="#eee" color="#7C7C7C">
              취소
            </Button>
          )}
          <Button
            onClick={onConfirm}
            $backgroundColor={isRedButton ? "#e20000" : "#002C5F"}
            color="#fff"
          >
            확인
          </Button>
        </ButtonWrapper>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmDialog;
