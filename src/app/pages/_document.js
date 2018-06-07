import Document, { Head, Main, NextScript } from 'next/document'

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
        </Head>
        <body
          style={{
            margin: 0,
            padding: 0,
            fontFamily: 'Nunito',
            color: '#484848',
            textDecoration: 'none',
            color: 'inherit',
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
