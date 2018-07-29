import Document, { Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    return { html, head, errorHtml, chunks };
  }

  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link href="https://fonts.googleapis.com/css?family=Nunito:200,500,700" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet"/>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}}
          />
        </Head>
        <body
          style={{
            margin: 0,
            padding: 0,
            fontFamily: 'Nunito',
            color: '#484848',
            textDecoration: 'none',
            listStyleType: 'none'
          }}
        className='body'>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
