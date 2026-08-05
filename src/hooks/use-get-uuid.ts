import React, { useEffect, useState } from 'react';

export const useGetUUID = () => {
  const [uuid, setUuid] = useState<string>(React.useId());

  useEffect(() => {
    setUuid(() => crypto.randomUUID());
  }, []);

  return uuid;
};
