import { VFC } from 'react';
import InputForm from 'InputForm';
import Heading from 'Heading';
import { Container } from 'semantic-ui-react';

const App: VFC = () => (
  <Container style={{ padding: '1em' }}>
    <Heading />
    <InputForm />
  </Container>
);

export default App;
