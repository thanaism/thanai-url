import { VFC } from 'react';
import { Message } from 'semantic-ui-react';

const PreviewMessage: VFC<{ username: string }> = (props) => {
  const { username } = props;

  return (
    <Message warning={!username} positive={!!username}>
      <Message.Header>
        {username === '' ? 'This is a test product.' : 'Thank you for login!'}
      </Message.Header>
      {username === ''
        ? 'Every URL will be deleted after a day.'
        : `Hi, ${username}! Your link is valid for 1 month!`}
    </Message>
  );
};

export default PreviewMessage;
