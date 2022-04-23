import { useEffect, useState, VFC } from 'react';
import InputForm from 'InputForm';
import Heading from 'Heading';
import axios, { AxiosResponse } from 'axios';
import LoginButton from 'LoginButton';
import { Container, Grid } from 'semantic-ui-react';
import PreviewMessage from 'PreviewMessage';
import AuthorLink from 'AuthorLink';
import Ad from 'Ad';

type ClientPricipal = {
  clientPrincipal: {
    identityProvider: 'aad' | 'github' | 'twitter';
    userId: string;
    userDetails: string;
    userRoles: ['anonymous', 'authenticated'];
    claims: [];
  };
};

const App: VFC = () => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    void (async (): Promise<void> => {
      await axios
        .get(`/.auth/me`)
        .then((res: AxiosResponse<ClientPricipal>) => {
          setUsername(res.data.clientPrincipal.userDetails);
        });
    })();
  });

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
