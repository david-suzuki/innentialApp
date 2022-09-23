import { ReactComponent as IconStats } from '$/static/NewNav_assets/admin-route-icons/stats.svg'
import { ReactComponent as IconDashboard } from '$/static/NewNav_assets/user-route-icons/dashboard.svg'
import { ReactComponent as IconReviews } from '$/static/NewNav_assets/admin-route-icons/reviews.svg'
import { ReactComponent as IconGoals } from '$/static/NewNav_assets/user-route-icons/goals.svg'
import { ReactComponent as IconLearning } from '$/static/NewNav_assets/user-route-icons/learning.svg'
import { ReactComponent as IconPaths } from '$/static/NewNav_assets/user-route-icons/paths.svg'
import { ReactComponent as IconOrganization } from '$/static/NewNav_assets/user-route-icons/teams+organization.svg'
import { ReactComponent as IconSearch } from '$/static/NewNav_assets/user-route-icons/search.svg'
import { ReactComponent as IconFeedback } from '$/static/NewNav_assets/user-route-icons/message-square.svg'
import { ReactComponent as IconEvents } from '$/static/NewNav_assets/user-route-icons/star.svg'

const teamRoute = {
  name: 'My Teams',
  path: '/teams',
  Icon: IconOrganization
}

const sharedContentTab = {
  name: 'Shared',
  url: '/shared'
}

const fulfillmentRequestsTab = {
  name: 'Delivery',
  url: '/delivery'
}

const feedbackRoute = {
  name: 'Feedback',
  path: '/feedback-page',
  Icon: IconFeedback,
  tabs: [
    {
      name: 'Received',
      url: '/received'
    },
    {
      name: 'Pending',
      url: '/pending',
      extraProp: 'pendingFeedbackRequests'
    },
    {
      name: 'Given',
      url: '/given'
    },
    {
      name: 'Colleague Requests',
      url: '/requests'
    }
  ]
}

// const corporate = true

export const ReviewRoutes = leader => ({
  name: 'Reviews',
  path: '/reviews',
  Icon: IconReviews,
  tabs: [
    {
      name: 'Open',
      url: '/open'
    },
    {
      name: 'Upcoming',
      url: '/upcoming'
    },
    {
      name: 'Closed',
      url: '/past'
    },
    leader && {
      name: 'Scheduled',
      url: '/scheduled'
    }
  ].filter(tab => !!tab)
})

export const BaseRoutes = ({
  hasTeam,
  reviewRoute,
  isReviewer,
  leader,
  premium,
  corporate,
  fulfillment,
  hasEvent
}) =>
  [
    {
      name: 'Home',
      path: '/',
      Icon: IconDashboard
    },
    premium && corporate && feedbackRoute,
    {
      name: 'Paths',
      path: '/learning-paths',
      Icon: IconPaths,
      tabs: [
        {
          name: 'Path Library',
          url: '/dashboard'
        },
        leader && {
          name: 'Manage Team Paths',
          url: '/organization'
        },
        {
          name: 'Discussions',
          url: '/discussions'
        }
      ].filter(t => !!t)
      // label: 'NEW'
    },
    {
      name: 'Quick Search',
      path: '/quick-search',
      Icon: IconSearch
    },
    {
      name: 'Library',
      path: '/library',
      Icon: IconLearning,
      tabs: [
        {
          name: 'Saved for later',
          url: '/saved'
        },
        fulfillment && fulfillmentRequestsTab,
        {
          name: 'Completed',
          url: '/completed'
        },
        {
          name: 'Uploaded',
          url: '/uploaded'
        },
        hasTeam && sharedContentTab
      ].filter(tab => !!tab)
    },
    hasEvent && {
      name: 'Events',
      path: '/events',
      Icon: IconEvents,
      tabs: [
        {
          name: 'My events',
          url: '/my-events'
        },
        {
          name: 'Invitations',
          url: '/invitations',
          extraProp: 'invitationsCount'
        },
        {
          name: 'Past',
          url: '/past'
        }
      ].filter(tab => !!tab)
    },
    hasTeam && teamRoute,
    (isReviewer || leader) && premium && reviewRoute,
    premium && !corporate && feedbackRoute
    // {
    //   name: 'Goals',
    //   path: '/goals',
    //   Icon: IconGoals,
    //   tabs: [
    //     {
    //       name: 'Draft',
    //       url: '/draft'
    //     },
    //     {
    //       name: 'Active',
    //       url: '/active'
    //     },
    //     {
    //       name: 'Completed',
    //       url: '/completed'
    //     },
    //     leader && {
    //       name: 'Approval',
    //       url: '/approval'
    //     }
    //   ].filter(tab => !!tab)
    // }
  ].filter(route => !!route)

export const AdminRoutes = ({
  hasTeam,
  premium,
  corporate,
  fulfillment,
  hasEvent
}) =>
  [
    {
      name: 'Home',
      path: '/',
      Icon: IconDashboard
    },
    premium && corporate && feedbackRoute,
    {
      name: 'Paths',
      path: '/learning-paths',
      Icon: IconPaths,
      tabs: [
        {
          name: 'Path Library',
          url: '/dashboard'
        },
        {
          name: 'Manage Paths',
          url: '/organization'
        },
        {
          name: 'Discussions',
          url: '/discussions'
        }
      ]
      // label: 'NEW'
    },
    {
      name: 'Quick Search',
      path: '/quick-search',
      Icon: IconSearch
    },
    {
      name: 'Library',
      path: '/library',
      Icon: IconLearning,
      tabs: [
        {
          name: 'Saved for later',
          url: '/saved'
        },
        fulfillment && fulfillmentRequestsTab,
        {
          name: 'Completed',
          url: '/completed'
        },
        {
          name: 'Uploaded',
          url: '/uploaded'
        },
        hasTeam && sharedContentTab
      ].filter(tab => !!tab)
    },
    hasEvent && {
      name: 'Events',
      path: '/events',
      Icon: IconEvents,
      tabs: [
        {
          name: 'My events',
          url: '/my-events'
        },
        {
          name: 'Invitations',
          url: '/invitations',
          extraProp: 'invitationsCount'
        },
        {
          name: 'Past',
          url: '/past'
        },
        {
          name: 'Manage Events',
          url: '/manage-events'
        }
      ].filter(tab => !!tab)
    },
    {
      name: 'Organization',
      path: '/organization',
      Icon: IconOrganization,
      tabs: [
        {
          name: 'Teams',
          url: '/teams'
        },
        {
          name: 'Users',
          url: '/users'
        },
        /* premium && */ {
          name: 'Skills',
          url: '/skills'
        },
        {
          name: 'Settings',
          url: '/settings'
        },
        {
          name: 'Roles',
          url: '/roles'
        }
        // premium && {
        //   name: 'Path Templates',
        //   url: '/path-templates'
        // }
      ].filter(tab => !!tab)
    },
    // {
    //   name: 'Events',
    //   path: '/events',
    //   Icon: IconEvents,
    //   tabs: [
    //     {
    //       name: 'My events',
    //       url: '/my-events'
    //     },
    //     {
    //       name: 'Past',
    //       url: '/past'
    //     },
    //     {
    //       name: 'Drafts',
    //       url: '/drafts'
    //     },
    //     {
    //       name: 'Manage Events',
    //       url: '/manage-events'
    //     }
    //   ].filter(tab => !!tab)
    //   },
    premium && {
      name: 'Reviews',
      path: '/reviews',
      Icon: IconReviews,
      tabs: [
        {
          name: 'Open',
          url: '/open'
        },
        {
          name: 'Upcoming',
          url: '/upcoming'
        },
        {
          name: 'Closed',
          url: '/past'
        },
        {
          name: 'Scheduled',
          url: '/scheduled'
        }
      ]
    },
    premium && !corporate && feedbackRoute
    // {
    //   name: 'Goals',
    //   path: '/goals',
    //   Icon: IconGoals,
    //   tabs: [
    //     {
    //       name: 'Draft',
    //       url: '/draft'
    //     },
    //     {
    //       name: 'Active',
    //       url: '/active'
    //     },
    //     {
    //       name: 'Completed',
    //       url: '/completed'
    //     },
    //     {
    //       name: 'Approval',
    //       url: '/approval'
    //     }
    //   ]
    // }
    // {
    //   name: 'Skills',
    //   path: '/skill-gap',
    //   icon: 'icon-ranking'
    // },
    // premium && {
    //   name: 'Statistics',
    //   path: '/statistics',
    //   Icon: IconStats
    // }
  ].filter(route => !!route)
