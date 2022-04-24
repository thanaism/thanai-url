import { VFC } from 'react';
import InputForm from 'InputForm';
import Heading from 'Heading';
import LoginButton from 'LoginButton';
import { Container, Grid } from 'semantic-ui-react';
import PreviewMessage from 'PreviewMessage';
import AuthorLink from 'AuthorLink';
import Ad from 'Ad';

const App: VFC = () => {
  const username = 'test-user';

  return (
    <Container style={{ padding: '1rem' }}>
      <Grid textAlign="center">
        <Grid.Row>
          <Grid.Column style={{ maxWidth: 600 }}>
            <Container>
              <Heading />
            </Container>
            <PreviewMessage username={username} />
            <InputForm username={username} />
            <AuthorLink />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <LoginButton username={username} />
        </Grid.Row>
        <Grid.Row>
          <Ad />
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default App;
