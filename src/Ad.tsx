import { VFC } from 'react';
import { Advertisement } from 'semantic-ui-react';

const Ad: VFC = () => (
  <Advertisement unit="medium rectangle" centered>
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2138626283121213"
      crossOrigin="anonymous"
    />
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2138626283121213"
      data-ad-slot="1571821525"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </Advertisement>
);

export default Ad;
