import { createContext, ReactNode, useContext, useState } from 'react';
import {
  CommunicationContextData,
  CommunicationContextType,
} from '../types/communication';

const defaultContext: CommunicationContextData = {
  communicationContext: undefined,
  setCommunicationContext: () => {},
};

const CommunicationContext = createContext(defaultContext);

export const useCommunicationContext = () => useContext(CommunicationContext);

export const CommunicationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [communicationContext, setCommunicationContext] = useState<
    CommunicationContextType | undefined
  >();

  return (
    <CommunicationContext.Provider
      value={{ communicationContext, setCommunicationContext }}
    >
      {children}
    </CommunicationContext.Provider>
  );
};
