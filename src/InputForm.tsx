/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import { useState, VFC } from 'react';
import { Grid, Form, Button, Message, Icon, Segment } from 'semantic-ui-react';

const InputForm: VFC = () => {
  const [input, setInput] = useState('https://');
  const [error, setError] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = async (): Promise<void> => {
    if (loading) return;
    if (output) {
      setOutput('');
      setInput('https://');

      return;
    }

    setLoading(true);
    setCopied(false);
    await axios
      .post(`/api/upload`, { url: input, alias: '' })
      .then((res) => {
        setOutput(res.data);
      })
      .catch(
        (_) => setError(true), // eslint-disable-line
      );
    setLoading(false);
  };
  const copyLinkToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
  };

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 600 }}>
        <Message warning>
          <Message.Header>This page is a test product.</Message.Header>
          Every URL will be deleted after a day.
        </Message>
        <Segment raised>
          <Form size="large">
            <Form.Input
              fluid
              icon="linkify"
              size="large"
              iconPosition="left"
              value={input}
              readOnly={!!output}
              error={
                error && {
                  content: 'Please enter a valid URL',
                  ointing: 'below',
                }
              }
              onChange={(e) => {
                setError(false);
                setInput(e.target.value);
              }}
            />

            <Button
              loading={loading}
              color="vk"
              fluid
              size="medium"
              onClick={result}
            >
              {output ? <Icon name="lightbulb" /> : <Icon name="sync" />}
              {output ? 'Try another one?' : 'Shrink URL'}
            </Button>

            {output && (
              <Message>
                <Grid.Column>
                  <a href={output} target="_blank" rel="noreferrer">
                    {output.replace('https://', '')}
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <Button onClick={copyLinkToClipboard}>
                    {copied ? 'Copied!' : 'Copy the link!'}
                  </Button>
                </Grid.Column>
              </Message>
            )}
          </Form>
        </Segment>
        <Message size='small'>

          Blog: &nbsp;
          <a href="https://dev.thanaism.com" target="_blank" rel="noreferrer">
            dev.thanaism
          </a>
          &emsp; / &emsp; Github: &nbsp;
          <a href="https://github.com/thanaism/thanai-url" target="_blank" rel="noreferrer">
            thanaism
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default InputForm;
