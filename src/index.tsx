import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import * as serviceWorker from "./serviceWorkerRegistration";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1c1e1f",
    },
    primary: {
      main: "#5865f2",
    },
  },
});
// http://localhost:4000/graphql

const { REACT_APP_SERVER_URL, REACT_APP_SERVER_WEBSOCKET } = process.env;

const httpLink = new HttpLink({
  uri: REACT_APP_SERVER_URL,
});

const wsLink = new WebSocketLink({
  uri: REACT_APP_SERVER_WEBSOCKET!,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
