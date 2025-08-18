export type CommunicationContextType = {
  kind: 'info' | 'warning' | 'error';
  message: string;
  code?: string;
};

export type CommunicationContextData = {
  communicationContext?: CommunicationContextType;
  setCommunicationContext: (
    communicationContext: CommunicationContextType | undefined
  ) => void;
};
