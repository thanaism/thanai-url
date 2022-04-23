import { useEffect, VFC } from 'react';
import { Advertisement } from 'semantic-ui-react';

interface AdsByGoogleWindow extends Window {
  adsbygoogle: any; // eslint-disable-line
}

declare const window: AdsByGoogleWindow;

const Ad: VFC = () => {
  useEffect(() => {
    if (window.adsbygoogle && process.env.NODE_ENV !== 'development')
      window.adsbygoogle.push({}); // eslint-disable-line
  }, []);

  return (
    <Advertisement unit="large rectangle">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2138626283121213"
        data-ad-slot="1571821525"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Advertisement>
  );
};

export default Ad;
