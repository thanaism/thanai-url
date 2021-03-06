import { VFC } from 'react';
import { Header } from 'semantic-ui-react';

const Heading: VFC = () => (
  <Header as="h1" size="huge" inverted textAlign="left">
    Thanai URL
    <Header.Subheader>Make URLs super short.</Header.Subheader>
  </Header>
);

export default Heading;
