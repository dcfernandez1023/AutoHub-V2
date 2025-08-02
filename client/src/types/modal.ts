import { JSX } from 'react';

export interface ModalBaseProps {
  show: boolean;
  title: string | JSX.Element;
  onClose: () => void;
  validationError?: string;
}
