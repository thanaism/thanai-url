import { VFC } from 'react';
import { Message } from 'semantic-ui-react';

const AuthorLink: VFC = () => (
  <Message size="small">
    Blog: &nbsp;
    <a href="https://dev.thanaism.com" target="_blank" rel="noreferrer">
      dev.thanaism
    </a>
    &emsp; / &emsp; Github: &nbsp;
    <a
      href="https://github.com/thanaism/thanai-url"
      target="_blank"
      rel="noreferrer"
    >
      thanaism
    </a>
  </Message>
);

export default AuthorLink;
