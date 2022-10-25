import { Deso } from 'deso-protocol';
import { GetExchangeRateResponse } from 'deso-protocol-types';
import { useEffect, useState } from 'react';
export const Playground = () => {
  const [healthCheck, setHealthCheck] = useState(0);
  const [exchangeRate, setExchangeRate] = useState<GetExchangeRateResponse>(
    {} as GetExchangeRateResponse
  );
  const deso = new Deso();
  useEffect(() => {
    (async () => {
      setHealthCheck(await deso.metaData.healthCheck());
      setExchangeRate(await deso.metaData.getExchangeRate());
    })();
  }, []);
  return (
    <>
      <div>Node health check: {healthCheck}</div>
      {Object.entries(exchangeRate).map((k, v) => {
        return (
          <div className="">
            {k}: {v}
          </div>
        );
      })}
    </>
  );
};