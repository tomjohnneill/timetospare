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
          <link href="https://fonts.googleapis.com/css?family=Nunito:200,500,700" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet"/>
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
