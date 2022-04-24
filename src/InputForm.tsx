/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import { useState, VFC } from 'react';
import { Grid, Form, Button, Message, Icon, Segment } from 'semantic-ui-react';
import useWindowDimensions from 'useWindowDimentsions';

const InputForm: VFC<{ username: string }> = (props) => {
  const { username } = props;
  const [urlInput, setUrlInput] = useState('https://');
  const [urlError, setUrlError] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [linkType, setLinkType] = useState('OneDay');
  const [aliasInput, setAliasInput] = useState('');
  const [aliasError, setAliasError] = useState(false);
  const [aliasErrorMessage, setAliasErrorMessage] = useState({
    content: 'must be alphanumeric in 4-10 chars',
    ointing: 'below',
  });
  const { width } = useWindowDimensions();

  const validateUrlString = (value: string): boolean =>
    value.length <= 4096 &&
    /^https?:\/\/[-0-9a-zA-Z.]{4,255}(\/[\w/:%#$&?()~.=+-]*)?$/.test(value) &&
    /^https?:\/\/([-0-9a-zA-Z]{1,63}\.)+[a-z]{2,}(\/[\w/:%#$&?()~.=+-]*)?$/.test(
      value,
    );

  const validateAlias = (value: string): boolean =>
    /^[-.!\w]{4,10}$/.test(value);

  const result = async (): Promise<void> => {
    if (loading) return;
    if (output) {
      setOutput('');
      setAliasInput('');
      setUrlInput('https://');

      return;
    }

    setLoading(true);
    setCopied(false);
    await axios
      .post(`/api/upload`, {
        url: urlInput,
        alias: aliasInput,
        linkType,
      })
      .then((res) => {
        setOutput(res.data);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (err.response.status) {
          case 400:
            setAliasError(true);
            setAliasErrorMessage({
              content: 'This alias is already used.',
              ointing: 'below',
            });
            break;
          default:
            setServerError(true);
        }
      });
    setLoading(false);
  };

  const copyLinkToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
  };

  const retentionPeriodOptions = [
    { key: 'One-Day', text: 'One-Day', value: 'OneDay' },
    { key: 'One-Month', text: 'One-Month', value: 'OneMonth' },
    { key: 'Permanent', text: 'Permanent', value: 'Permanent' },
  ];

  return (
    <Segment raised>
      <Form size="large">
        {!!username && (
          <Form.Dropdown
            placeholder="Select Retention Period"
            fluid
            button
            selection
            options={retentionPeriodOptions}
            onChange={(_, data) =>
              setLinkType(typeof data.value === 'string' ? data.value : '')
            }
          />
        )}

        <Form.Input
          fluid
          icon="linkify"
          size="large"
          iconPosition="left"
          placeholder="https://"
          value={urlInput}
          readOnly={!!output}
          error={
            urlError && {
              content: 'Please enter a valid URL',
              ointing: 'below',
            }
          }
          onChange={(e) => {
            setUrlError(false);
            if (e.target.value && !validateUrlString(e.target.value))
              setUrlError(true);
            setUrlInput(e.target.value);
          }}
        />

        <Form.Group grouped={width < 800}>
          <Form.Input
            readOnly={!!output}
            value={aliasInput}
            iconPosition="left"
            icon="quote left"
            placeholder="alias"
            error={aliasError && aliasErrorMessage}
            onChange={(e) => {
              setAliasError(false);
              if (e.target.value && !validateAlias(e.target.value)) {
                setAliasErrorMessage({
                  content: 'must be alphanumeric in 4-10 chars',
                  ointing: 'below',
                });
                setAliasError(true);
              }
              setAliasInput(e.target.value);
            }}
          />
          <Button
            loading={loading}
            color="vk"
            fluid
            size="medium"
            onClick={result}
            disabled={
              urlError || aliasError || serverError || urlInput === 'https://'
            }
          >
            {output ? <Icon name="lightbulb" /> : <Icon name="sync" />}
            {output ? 'Try another one?' : 'Shrink URL'}
          </Button>
        </Form.Group>

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

        {serverError && (
          <Message negative>
            <Icon name="circle notched" loading />
            <span style={{ whiteSpace: 'nowrap' }}>
              The server is down,
            </span>{' '}
            &ensp;
            <span style={{ whiteSpace: 'nowrap' }}>
              Please try again after a while.
            </span>
          </Message>
        )}
      </Form>
    </Segment>
  );
};

export default InputForm;
