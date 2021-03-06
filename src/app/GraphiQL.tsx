import React, {useState, useEffect} from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import './index.css';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'; // Colors for TextField component
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//  import Apollo11Logo from '-!svg-react-loader!../assets/logo.svg';
// const URL = 'https://swapi.graph.cool/';
// console.log('window', window.hasOwnProperty('__APOLLO_DEVTOOLS_GLOBAL_HOOK__'));
const defaultQuery = ``; // make a default query based on the endpoint

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '50%',
      },
    },
  }),
);

function GraphiQLPage() {
  const [endpoint, setEndpoint] = useState('');
  const [requestURI, setRequestURI] = useState('');
  const classes = useStyles();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('request received on GraphiQL tab:', request);
      setRequestURI(request.apolloURI);
      sendResponse('Hello from React');
    });
  }, []);

  /*
Desc: sends HTTP post request to GraphQL API
*/
  function graphQLFetcher(graphQLParms: any) {
    return fetch(requestURI, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(graphQLParms),
    }).then(response => {
      return response.json();
    });
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    /*
    send a simple request to the GraphQL API
    and confirm it is running and indeed a Gr
    */
  };
  const handleEndpointChange = (e: {target: {value: string}}) => {
    setEndpoint(e.target.value);
  };
  return (
    <div className="wrapper-mainql">
      <p>
        Enter your backend GraphQL endpoint, current endpoint = {requestURI}
      </p>
      <div id="endpoint-container">
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={e => handleSubmit(e)}>
          <TextField
            id="outlined-primary"
            label="Endpoint"
            variant="outlined"
            color="primary"
            onChange={e => handleEndpointChange(e)}
            value={requestURI}
          />
          <Button variant="contained" color="primary" type="submit">
            Connect
          </Button>
        </form>
      </div>
      <GraphiQL
        fetcher={graphQLFetcher}
        defaultQuery={defaultQuery}
        response={JSON.stringify('Hello')}
      />
    </div>
  );
}

export default GraphiQLPage;
