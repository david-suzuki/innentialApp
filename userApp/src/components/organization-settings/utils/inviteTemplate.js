import mapContentToRegularTemplate from './mapContentToRegularTemplate'

export const defaultMessage = `
Hello!<br/><br/>
You have been invited to join Innential!<br/><br/>
<b>What is Innential you ask?</b><br/>
It is a platform that <b>supports your personal growth</b>.<br/><br/>
After you finish onboarding to Innential you will be able to:
<ul>
  <li>Set goals and track progress of your development</li>
  <li>Find people and learning to help you with new skills </li>
  <li>Give and receive feedback to better plan your development </li>
  <li>…and contact us with any question that you might have via in-app chat :)</li>
</ul>
<br/>
`

export const firstInvitationTemplate = ({ customMessage }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: `Innential Invitation Email`,
    title: 'Welcome to Innential!',
    header: 'none',
    content: `${customMessage}
    <div class="box-center">
      <a class="box-button button button__cta">
        Setup your profile
      </a>
    </div>
    Best wishes,<br/>
    Innential Team<br/>
    `
  })
