import { VFC } from 'react';
import { Button } from 'semantic-ui-react';

const LoginButton: VFC<{ username: string }> = (props) => {
  const { username } = props;

  return (
    <>
      {!username && (
        <Button
          size="huge"
          secondary
          inverted
          as="a"
          href="/.auth/login/twitter"
        >
          Login
        </Button>
      )}
      {!!username && (
        <Button size="huge" secondary inverted as="a" href="/.auth/logout">
          Logout
        </Button>
      )}
    </>
  );
};

export default LoginButton;
