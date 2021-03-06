console.log('Executing contentScript.ts...');

interface IApolloClientHook {
  Apollo11Client: any;
}

function detectApolloClient(window: any) {
  const apolloClientHook: IApolloClientHook = {
    Apollo11Client: null,
  };

  // Need to add this eslint global to mitigate the following error:
  //   22:26  error    'NodeJS' is not defined       no-undef
  /* global NodeJS */
  let detectionInterval: NodeJS.Timeout;

  function findApolloClient() {
    if (window.__APOLLO_CLIENT__) {
      apolloClientHook.Apollo11Client = window.__APOLLO_CLIENT__;
      clearInterval(detectionInterval);
      console.log(
        'findClient - found Apollo client: ',
        apolloClientHook.Apollo11Client,
      );

      window.postMessage(
        {
          type: 'FROM_PAGE',
          text: 'Apollo Client URI',
          apolloURI: apolloClientHook.Apollo11Client.link.options.uri,
        },
        '*',
      );
    }
  }

  // TODO: We are only clearing the timer if the Apollo client is found, otherwise it will
  // keep running indefinitely.  We should consider stopping it after some extended period
  // of time, such as 10 minutes?  The original Apollo client code stopped after 10 seconds.
  detectionInterval = setInterval(findApolloClient, 1000);
}

// Need to inject our script as an IIFE into the DOM
// This will allow us to obtain the __APOLLO_CLIENT__ object
// on the application's window object.
// https://stackoverflow.com/questions/12395722/can-the-window-object-be-modified-from-a-chrome-extension
if (document instanceof HTMLDocument) {
  const script = document.createElement('script');
  script.textContent = `;(${detectApolloClient.toString()})(window)`;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}

/* //This message can be recieved by the React app

chrome.runtime.sendMessage({message: 'hello from bg'}, function (response) {
  console.log('response from react', response);
}); */

const port = chrome.runtime.connect();

window.addEventListener(
  'message',
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type && event.data.type == 'FROM_PAGE') {
      // send the apolloclient URI to the React app
      chrome.runtime.sendMessage({
        message: event.data.text,
        apolloURI: event.data.apolloURI,
      });
    }
  },
  false,
);
