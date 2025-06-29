export interface ModalBaseProps {
  show: boolean;
  title: string;
  onClose: () => void;
  validationError?: string;
}
