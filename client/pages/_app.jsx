import client from "@/apollo-client";
import Navbar from "@/components/Navbar/Navbar";
import { ApolloProvider } from "@apollo/client";
import { createGlobalStyle } from "styled-components";
import colors from "@/constant/colors";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "../styles/app.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import store from "@/store/store";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-size: 62.5%;
    background-color: ${colors.white};
    font-family: 'Noto Sans Thai', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <Provider store={store}>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Navbar />
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </>
  );
}
