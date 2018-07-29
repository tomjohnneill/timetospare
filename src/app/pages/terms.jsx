import React from 'react'
import Divider from 'material-ui/Divider';
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';

const styles = {
  mainHeader: {
    fontWeight: 700,
    fontSize: '40px'
  },
  header: {
    fontWeight: 'lighter',
    fontSize: '24px',
    paddingTop: 20,
    paddingBottom: 10
  },
  midHeader: {
    fontWeight: 700,
    fontSize: '32px',
    paddingTop: 30,
    paddingBottom: 10
  },
  body: {
    paddingTop: 10
  }
}

export class Terms extends React.Component {
  render() {
    return (
      <App>
      <div style={{width: '100%', display: 'flex', alignItems: 'center',
        paddingTop: 50, justifyContent: 'center'}}>
        <div style={{maxWidth: 900, width: '100%', boxSizing: 'border-box', padding: 24, textAlign: 'left'}}>
          <div style={styles.mainHeader} className='main-header'>
            Terms & Conditions
          </div>
          <Divider style={{marginTop: 20, marginBottom: 20}}/>
          <div style={styles.body} className='body-para'>
            We’ve written these terms in plain English. This doesn’t mean they’re not legally valid.
          </div>
          <div style={styles.body} className='body-para'>
            We hope it means more people read and understand them, which is important,
             because if you don’t agree to them, you can’t use Time to Spare.
          </div>
          <div style={styles.midHeader} className='mid-header'>
            Our terms:
          </div>
      
          <div style={styles.header} className='header'>
            Your Data:
          </div>
          <div style={styles.body} className='body-para'>
            You own the rights to anything you post onto the site.
          </div>
          <div style={styles.body} className='body-para'>
            We do not sell your data to any data brokers or advertising companies.
          </div>
          <div style={styles.body} className='body-para'>
            When you sign up for a project, we share your email address and phone
             number with the organiser. This is so that the organiser can contact
              you if anything changes.
          </div>
          <div style={styles.body} className='body-para'>
            You can delete any information whenever you like.
            We will not keep the data after you delete it, but it may take up to
             30 days to delete it from all of our backups and caches.
          </div>

          <div style={styles.header} className='header'>
            When do we share data with other people?
          </div>
          <div style={styles.body} className='body-para'>
            Like most websites, we use Google Analytics. This means we store
             information about how you use the site so that we can try to
             improve the service in future.
          </div>
          <div style={styles.body} className='body-para'>
            When you create an account linked to a phone number,
             we share this phone number with Google to check against
             a list of known fake numbers, and to send the verification code.
          </div>
          <div style={styles.body} className='body-para'>
            To let you send Facebook Messenger links to our projects,
             we also load some code from Facebook.
          </div>

          <div style={styles.midHeader} className='header'>
            What we need from you:
          </div>
          <div style={styles.body} className='body-para'>
          When using the site, don’t do anything that
          will negatively harm our company or the community.
          </div>
          <div style={styles.body} className='body-para'>
            Don’t try and access somebody else’s account.
            Don’t try and delete or change data that doesn’t belong to you.
          </div>
          <div style={styles.body} className='body-para'>
            Don’t try and crash the site by overloading our servers
             with any automated traffic.
          </div>
          <div style={styles.body} className='body-para'>
            Don’t be under the age of 13.
          </div>
          <div style={styles.body} className='body-para'>
            Don’t do anything illegal.
          </div>

          <div style={styles.header} className='header'>
            As an organiser:
          </div>
          <div style={styles.body} className='body-para'>
            Organisers promise to only use contact information for communication relevant
            to the project - not for a general purpose mailing list, and not for spam.
          </div>
          <div style={styles.body} className='body-para'>
            Organisers promise that projects will be ‘for good’. Just to be clear,
            this doesn’t mean you have to be a charity or a social enterprise.
            We believe that individuals, companies and even governments can do good things,
            and if the main purpose is good, and not for your own benefit,
            anyone can start a project.
          </div>
          <div style={styles.body} className='body-para'>
            Organisers will do their best to make sure that the information they
            post about the projects is correct and up to date.
          </div>

          <div style={styles.header} className='header'>
            As a ‘volunteer’:
          </div>
          <div style={styles.body} className='body-para'>
            Only create 1 account.
          </div>
          <div style={styles.body} className='body-para'>
            Make sure your contact information is correct.
          </div>

          <div style={styles.header} className='header'>
            As a robot:
          </div>
          <div style={styles.body} className='body-para'>
            See our robots.txt
          </div>

          <div style={styles.midHeader} className='header'>
            What you can expect from us:
          </div>
          <div style={styles.body} className='body-para'>
            We can’t promise to moderate everything on the site, but we may well
             need to delete things that we don’t think are in line with our mission
             , or are illegal or unethical.
            For this reason, we reserve the right to delete or edit anything on the website.
          </div>
          <div style={styles.body} className='body-para'>
            We’re not liable for any damages that you might occur from using the site.
            Sorry about that.
          </div>
        </div>
      </div>
      </App>
    )
  }
}

export default withMui(Terms)
