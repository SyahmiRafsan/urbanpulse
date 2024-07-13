import { useEffect, useState } from 'react';

const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  return isClient;
};

export default useIsClient;