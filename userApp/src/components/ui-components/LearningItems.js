import React from 'react'
import { LearningItemNew } from './'
// import { generateInitialsAvatar } from '$/utils'
import udemyLogo from '../../static/udemy-logo.png'
// import hubspotLogo from '../../static/hubspot-logo.png'

const LearningItems = props => {
  return props.items.map((learning, i) => (
    <LearningItemNew
      key={`${learning._id}:${i}`}
      idx={i}
      {...learning}
      onLinkClick={props.onLinkClick}
    />
  ))
}

LearningItems.defaultProps = {
  items: [
    {
      _id: '1',
      // shareInfo,
      skillTags: [{ name: 'Javascript', main: true }, { name: 'React' }],
      url: 'http://example.url',
      title: 'React course',
      icon: 'icon-collection',
      type: 'E-Learning',
      labels: [
        { name: 'FRESH', color: '#dc3250' },
        { name: 'PAID', color: '#5dca2e' }
      ],
      sourceInfo: { name: 'Udemy', icon: udemyLogo },
      shareInfo: {
        sharedBy: { firstName: 'Wojciech', lastName: 'J.', _id: 'aaaaa' },
        sharedTeams: 'Team All, Team 2'
      },
      author: 'Wes Bos',
      options: [
        [
          {
            icon: 'icon-send',
            text: 'Recommend',
            color: '#5fd7cd'
          }
        ],
        [
          {
            icon: 'icon-bookmark-delete',
            text: 'Unshare',
            color: '#dc3250'
          }
        ],
        [
          {
            icon: 'icon-favorite',
            text: 'Like',
            color: '#f5b764'
          },
          {
            icon: 'icon-ban',
            text: 'Dislike',
            color: '#979797'
          }
        ]
      ]
    },
    {
      _id: '2',
      // shareInfo,
      skillTags: [
        { name: 'Product Management', main: true },
        { name: 'Product Development' }
      ],
      goalInfo: { goalName: 'Learn Product Management', goalId: '3@!g82' },
      url: 'http://example.url',
      title: 'How we do product management',
      icon: 'icon-paper-2',
      type: 'Article',
      labels: [
        { name: 'RECOMMENDED', color: '#5fd7cd' },
        { name: 'FREE', color: '#5dca2e' }
      ],
      sourceInfo: { name: 'Medium' },
      author: 'A Company',
      options: [
        [
          {
            icon: 'icon-check-small',
            text: 'Mark completed',
            color: '#5dca2e'
          },
          {
            icon: 'icon-e-remove',
            text: 'Mark not started',
            color: '#979797'
          }
        ]
      ]
    }
  ]
}

export default LearningItems
