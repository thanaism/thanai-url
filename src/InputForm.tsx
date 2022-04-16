/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from "axios";
import { useState, VFC } from "react";
import { Grid, Form, Button, Segment, Message, Icon } from "semantic-ui-react";

const InputForm: VFC = () => {
  const [input, setInput] = useState('https://');
  const [error, setError] = useState(false);
  const [output, setOutput] = useState('');
  const [previousInput, setPreviousInput] = useState('');

  const result = async (): Promise<void> => {
    if (input === previousInput) return;
    await axios.post(`/api/upload`, { url: input, alias: '' })
      .then(res => { setOutput(res.data); setPreviousInput(input) })
      .catch(_ => setError(true) // eslint-disable-line
      );
  };
  const copyLinkToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(output);
  }

  return (
    <Grid textAlign='center'>
      <Grid.Column style={{ maxWidth: 600 }}>
        <Message warning >
          <Message.Header>This page is a test product.</Message.Header>
          Every shrinked URL will be deleted after a day.
        </Message>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='linkify'
              size='large'
              iconPosition='left'
              placeholder={input}
              error={error && {
                content: 'Please enter a valid URL',
                ointing: 'below',
              }}
              onChange={(e) => { setError(false); setInput(e.target.value) }}
            />

            <Button color='vk' fluid size='medium' onClick={result}>
              <Icon name='sync' />URL Shrink
            </Button>

            {output && <Message>
              <Grid.Column>
                <a href={output} target='_blank' rel="noreferrer">{output.replace('https://', '')}</a>
              </Grid.Column>
              <Grid.Column>
                <Button onClick={copyLinkToClipboard}>Copy the link!</Button>
              </Grid.Column>
            </Message>}

          </Segment>
        </Form>
        <Message>
          Developer&apos;s blog: &nbsp; <a href='https://dev.thanaism.com' target='_blank' rel="noreferrer">dev.thanaism</a>
        </Message>
      </Grid.Column>
    </Grid>
  )
};

export default InputForm;
