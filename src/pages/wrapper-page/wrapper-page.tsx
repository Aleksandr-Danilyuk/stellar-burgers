import React, { ReactNode } from 'react';

interface WrapperPageProps {
  children: ReactNode;
}

export function WrapperPage({ children }: WrapperPageProps) {
  return <div>{children}</div>;
}

// export default WrapperPage;
