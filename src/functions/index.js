import { nextApp as next } from "./app/app"
import { mars } from "./worlds/mars"
import { jupiter } from "./worlds/jupiter"
import { mailchimpAuth } from "./mailchimp/auth"
import {getListOfLists, getContacts} from './mailchimp/import.js';
import {updateContactRecord,  makeNewUserAdmin} from './users/members.js';
import {sendCustomEmail, receiveReply} from './messaging/emails.js';
import {sendCustomSMS} from './messaging/sms.js';
import {sendInviteEmail} from './transactional/signup.js';
import {outlookAuth,scrapeOutlookEmails, scrapeCalendarEvents} from './integrations/outlook.js';
import {getEventbriteOrganisations, getEventAttendees, getEventList, getOneEventAttendees} from './integrations/eventbrite.js';
import {wrapCors} from './integrations/cors.js';
import {summaryAggregation, basicSearch, basicOrganisationAggregation, addDocument, addMember, addOrg, indexAllInteractions, indexAllMembers, indexAllOrgs} from './elastic/search.js';

/*
Namespace application services with function groups.
Partially deploy namespaces for independent service updates.
*/

// SSR Next.js app Cloud Function used by Firebase Hosting
// yarn deploy-app
const app = {
  next,
  // other Hosting dependencies
}

// Mircoservices that make up the Greetings service
// yarn deploy-functions
const greetings = {
  mars,
  jupiter,
  mailchimpAuth
  // other funcs
}

const mailchimp = {
  getListOfLists,
  getContacts
}

const users = {
  makeNewUserAdmin,
  updateContactRecord
}

const messaging = {
  sendCustomEmail,
  sendCustomSMS,
  receiveReply
}

const transactional = {
  sendInviteEmail
}

const integrations = {
  outlookAuth,
  scrapeOutlookEmails,
  scrapeCalendarEvents,
  getEventbriteOrganisations,
  getEventAttendees,
  getEventList,
  getOneEventAttendees,
  wrapCors
}

const elastic = {
  summaryAggregation, basicSearch, basicOrganisationAggregation, addDocument, addMember, addOrg, indexAllInteractions, indexAllMembers, indexAllOrgs
}

export { app, greetings, mailchimp, users, messaging, transactional, integrations, elastic}
