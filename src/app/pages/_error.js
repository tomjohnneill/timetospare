import * as Sentry from '@sentry/browser';
import React from 'react';
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import {headerStyles} from '../components/styles.jsx';

Sentry.init({ dsn: "https://fb230d215bd745d6a8152f6145c8a409@sentry.io/1324566"});

/**
 * Send an error event to Sentry.
 *
 * Server-side:
 * Next.js captures SSR errors and never passes them to the Sentry
 * middleware. It does, however, render the _error.js component, so
 * we can manually fire Sentry events here.
 *
 * Client-side:
 * Unhandled client exceptions will always bubble up to the _error.js
 * component, so we can manually fire events here.
 */
const notifySentry = (err, req, statusCode) => {
  Sentry.configureScope((scope) => {
    if (!req) {
      scope.setTag(`ssr`, false);
    } else {
      scope.setTag(`ssr`, true);
      scope.setExtra(`url`, req.url);
      scope.setExtra(`params`, req.params);
      scope.setExtra(`query`, req.query);
      scope.setExtra(`statusCode`, statusCode);
      scope.setExtra(`headers`, req.headers);

      if (req.user) {
        scope.setUser({ id: req.user.id, email: req.user.email });
      }
    }
  });

  Sentry.captureException(err);
};

export  class Error extends React.Component {
  static async getInitialProps({ req, res, err }) {
    let statusCode;

    if (res) {
      ({ statusCode } = res);
    } else if (err) {
      ({ statusCode } = err);
    } else {
      statusCode = null;
    }

    notifySentry(err, req, statusCode);

    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    console.log(this.props)


    return (
      <div>
        <App>
          <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
            transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -250,
             width: '20vw', height: '100vw'}}/>
             <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
               transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
                width: '30vw', height: '100vw'}}/>
          <div style={{display: 'flex',  minHeight: '100vh', justifyContent: 'center', padding: 10}}>
            <div style={{maxWidth: 700}}>
              <div style={headerStyles.desktop}>
                Sorry, something went wrong on our end
              </div>
              <div style={{textAlign: 'left', paddingBottom: 10}}>
                Error code: {statusCode}
              </div>
              <img src='https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ca27365d9e28faedc467828e6f6fe5f&auto=format&fit=crop&w=1050&q=80'
                style={{width: '100%', borderRadius: 10}}
                />
            </div>
          </div>
        </App>
      </div>
    )

  }
}

export default withMui(Error)
