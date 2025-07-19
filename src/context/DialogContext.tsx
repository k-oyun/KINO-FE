import { createContext, useContext, useState } from "react";

export interface DialogOptions {
  isOpen: boolean;
  title?: string;
  message?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isRedButton?: boolean;
}

const DialogContext = createContext<{
  dialog: DialogOptions;
  openDialog: (options: Omit<DialogOptions, "isOpen">) => void;
  closeDialog: () => void;
}>({
  dialog: { isOpen: false },
  openDialog: () => {},
  closeDialog: () => {},
});

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions>({ isOpen: false });

  const openDialog = (options: Omit<DialogOptions, "isOpen">) =>
    setDialog({ ...options, isOpen: true });

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  return (
    <DialogContext.Provider value={{ dialog, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
