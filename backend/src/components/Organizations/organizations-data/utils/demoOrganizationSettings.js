export const devTeamSettings = {
  teamName: 'IT Team',
  teamMembers: [
    {
      firstName: 'Arthur',
      lastName: 'Morgan',
      roleAtWork: 'Senior Full-Stack Developer'
    },
    {
      firstName: 'Jane',
      lastName: 'Poe',
      roleAtWork: 'Mid-level Full-Stack Developer'
    },
    {
      firstName: 'Amanda',
      lastName: 'Fro',
      roleAtWork: 'Junior Full-Stack Developer'
    },
    {
      firstName: 'Jake',
      lastName: 'Sparer',
      roleAtWork: 'Junior Full-Stack Developer'
    },
    {
      firstName: 'Tim',
      lastName: 'Batman',
      roleAtWork: 'Junior Full-Stack Developer'
    }
  ],
  categoriesSlugs: ['SOFTWARE', 'PROGRAMMING LANGUAGES', 'DATABASES'],
  // roleAtWork: 'Developer',
  guaranteedSkill: 'Javascript',
  goals: [
    {
      goalName: 'Better database knowledge',
      relatedSkill: ['MongoDB'],
      measureName: [
        'Can setup MongoDB by yourself',
        'Can create performant data models'
      ],
      feedback:
        'Good understanding of mongo, successfully deployed a mongo instance'
    },
    {
      goalName: `Learn how to setup load balancers so that our server's don't go down`,
      relatedSkill: [],
      measureName: ['Setup load balancers'],
      feedback: 'Our infrastructure has improved drastically'
    },
    {
      goalName:
        'Learn how to optimise the performance of the consumer facing product',
      relatedSkill: ['React', 'HTML'],
      measureName: [
        'Reduce component overhead',
        'Site performance increased 3x'
      ],
      feedback: 'Understands the state of our platform better than anyone'
    },
    {
      goalName: 'Make developing more fun',
      relatedSkill: ['Webpack'],
      measureName: ['Reduce compile times'],
      feedback: 'Very good job! We will save hundreds of hours every year!'
    },
    {
      goalName: 'Improve UX',
      relatedSkill: ['React', 'HTML'],
      measureName: ['Reduce component overhead', 'Responsive component design'],
      feedback: "We don't need to use any CSS/Component libraries"
    },
    {
      goalName: 'Optimize Cache',
      relatedSkill: ['React', 'MongoDB'],
      measureName: ['Reduce server costs'],
      feedback: 'The main requirements for the app are cached very efficiently!'
    }
  ]
}

export const productTeamSettings = {
  teamName: 'Product Team',
  teamMembers: [
    { firstName: 'Nicky', lastName: 'Vick', roleAtWork: 'Product Owner' },
    {
      firstName: 'Poe',
      lastName: 'Joe',
      roleAtWork: 'Senior Product Specialist'
    },
    {
      firstName: 'Charles',
      lastName: 'Fro',
      roleAtWork: 'Senior Product Specialist'
    },
    {
      firstName: 'Anne',
      lastName: 'Bonnie',
      roleAtWork: 'Junior Product Specialist'
    },
    {
      firstName: 'Sarah',
      lastName: "O'Connor",
      roleAtWork: 'Junior Product Specialist'
    }
  ],
  categoriesSlugs: ['PRODUCT', 'BUSINESS', 'DESIGN'],
  // roleAtWork: 'Product Development',
  guaranteedSkill: 'Branding',
  goals: [
    {
      goalName: 'Understanding of agile methodologies',
      relatedSkill: ['Product Development'],
      measureName: [
        'Reading one book about Scrum',
        'Visiting one conference for the topic of agile product development'
      ],
      feedback:
        'Good understanding of different agile frameworks and when to use what'
    },
    {
      goalName: 'Learn how to set up a product roadmap',
      relatedSkill: ['Product Management'],
      measureName: [
        'Knowing the steps of how to create a product roadmap',
        'Create a first draft of a product roadmap'
      ],
      feedback:
        'The product roadmap includes all relevant aspects and is inspiring for the development team'
    },
    {
      goalName:
        'Using an efficient product management task - tool for product development',
      relatedSkill: ['Product Management'],
      measureName: [
        'Defining the criteria with other stakeholder',
        'Checking 3 different tools'
      ],
      feedback: 'We implemented a suitable tool, which improved our efficiency'
    },
    {
      goalName: 'Using the right data for product decisions',
      relatedSkill: ['Google Analytics'],
      measureName: [
        'Reading a book about data science',
        'Doing a webinar about google analytics',
        'Creating a first dashboard to track the main KPIs'
      ],
      feedback:
        'Our decisions are more data based than before and we are able to improve the product value'
    },
    {
      goalName: 'Learn UX design for product management',
      relatedSkill: ['Product Management'],
      measureName: [
        'Having regular check ins with an experience UX designer',
        'Define a process, how embedded UX could look like in product development process'
      ],
      feedback:
        'We can test our prototypes much faster, through an early user testing in a proper way'
    }
  ]
}

export const hrTeamSettings = {
  teamName: 'HR Team',
  teamMembers: [
    { firstName: 'Mel', lastName: 'Motler', roleAtWork: 'Senior HR Manager' },
    { firstName: 'Jay', lastName: 'Jameson', roleAtWork: 'HR Manager' },
    {
      firstName: 'Annie',
      lastName: 'Daniels',
      roleAtWork: 'Talent Acquisition Specialist'
    }
    // { firstName: 'Ellie', lastName: 'Yorkshire', roleAtWork: '' },
    // { firstName: 'May', lastName: 'June', roleAtWork: '' }
  ],
  categoriesSlugs: [
    'HUMANITIES',
    'ENTREPRENEURSHIP',
    'BUSINESS',
    'HUMAN_RESOURCES'
  ],
  // roleAtWork: 'Human Resources',
  guaranteedSkill: 'Employer Branding',
  goals: [
    {
      goalName: 'Get a basic understanding of systemic coaching',
      relatedSkill: ['Coaching'],
      measureName: [
        'Knowing basic approaches of coaching and when to use',
        'Evaluation of 3 different trainings to become a coach'
      ],
      feedback:
        'Good understanding of coaching frameworks and for which situations the skill is useful'
    },
    {
      goalName: 'Learn how to create a HR strategy',
      relatedSkill: ['HR Strategy'],
      measureName: [
        'Knowing the steps of creating a HR strategy',
        'Create a first draft of a HR strategy for my own working environment'
      ],
      feedback:
        'The draft of the HR strategy is connected to other business related departments and gives the company and good longterm perspective for HR'
    },
    {
      goalName: 'Build a KPI dashboard for HR',
      relatedSkill: ['People Analytics'],
      measureName: [
        'Defining the most important KPIs for HR',
        'Creating a dashboard connected to the KPIs'
      ],
      feedback:
        'Relevant KPIs are chosen and the dashboard helps very good for future planing and adjusting processes.'
    },
    {
      goalName: 'Hiring people in time for the most crucial roles',
      relatedSkill: ['Recruiting'],
      measureName: [
        'Defining a recruiting process',
        'Brief all stakeholders for creating an efficient process',
        '5 signings until end of Q1'
      ],
      feedback:
        'All positions are filled in time with the best candidates and everyone liked the recruiting process'
    },
    {
      goalName: 'Improve the employer brand for my company',
      relatedSkill: ['Employer Branding'],
      measureName: [
        'Checking 3 new trends for setting up a great employer brand',
        'Applying at least 1 new approach to improve the employer brand'
      ],
      feedback:
        'Our company has more visibility on the market and we received more applications through the campagne.'
    }
  ]
}

export const roleSettings = [
  {
    groupName: 'Product',
    relatedRoles: [
      {
        title: 'Junior Product Specialist',
        coreSkills: [
          { slug: 'giving_ownership', level: 3 },
          { slug: 'delivering_feedback', level: 2 },
          { slug: 'collaboration', level: 3 },
          { slug: 'agile_working', level: 3 },
          { slug: 'storytelling', level: 2 },
          { slug: 'product_development', level: 2 },
          { slug: 'copywriting', level: 3 },
          { slug: 'branding', level: 3 }
        ],
        nextSteps: ['Senior Product Specialist']
      },
      {
        title: 'Senior Product Specialist',
        coreSkills: [
          { slug: 'giving_ownership', level: 3 },
          { slug: 'delivering_feedback', level: 4 },
          { slug: 'collaboration', level: 4 },
          { slug: 'agile_working', level: 4 },
          { slug: 'storytelling', level: 3 },
          { slug: 'product_development', level: 3 },
          { slug: 'copywriting', level: 4 },
          { slug: 'branding', level: 4 }
        ],
        nextSteps: ['Product Owner']
      },
      {
        title: 'Product Owner',
        coreSkills: [
          { slug: 'product_management', level: 4 },
          { slug: 'product_strategyp', level: 4 },
          { slug: 'innovating', level: 4 },
          { slug: 'independence', level: 3 },
          { slug: 'goal_setting', level: 3 },
          { slug: 'entrepreneurial_spirit', level: 3 },
          { slug: 'delivering_feedback', level: 4 },
          { slug: 'collaboration', level: 4 },
          { slug: 'agile_working', level: 4 },
          { slug: 'storytelling', level: 5 },
          { slug: 'product_development', level: 5 },
          { slug: 'copywriting', level: 4 },
          { slug: 'branding', level: 5 }
        ],
        nextSteps: []
      }
    ]
  },
  {
    groupName: 'IT - Development',
    relatedRoles: [
      {
        title: 'Junior Full-Stack Developer',
        coreSkills: [
          { slug: 'communicating_effectively_in_a_team', level: 3 },
          { slug: 'dealing_with_ambiguity', level: 2 },
          { slug: 'independence', level: 1 },
          { slug: 'python', level: 2 },
          { slug: 'react', level: 3 },
          { slug: 'mysql', level: 2 },
          { slug: 'docker', level: 1 },
          { slug: 'html', level: 3 },
          { slug: 'css', level: 2 },
          { slug: 'user_experience_design', level: 2 },
          { slug: 'user_interface_design', level: 2 }
        ],
        nextSteps: ['Mid-level Full-Stack Developer']
      },
      {
        title: 'Mid-level Full-Stack Developer',
        coreSkills: [
          { slug: 'communicating_effectively_in_a_team', level: 4 },
          { slug: 'dealing_with_ambiguity', level: 3 },
          { slug: 'independence', level: 3 },
          { slug: 'python', level: 3 },
          { slug: 'react', level: 4 },
          { slug: 'mysql', level: 3 },
          { slug: 'docker', level: 3 },
          { slug: 'html', level: 4 },
          { slug: 'css', level: 4 },
          { slug: 'user_experience_design', level: 3 },
          { slug: 'user_interface_design', level: 3 }
        ],
        nextSteps: ['Senior Full-Stack Developer']
      },
      {
        title: 'Senior Full-Stack Developer',
        coreSkills: [
          { slug: 'design_patterns', level: 3 },
          { slug: 'continuous_integration', level: 4 },
          { slug: 'continuous_deployment', level: 3 },
          { slug: 'communicating_effectively_in_a_team', level: 5 },
          { slug: 'dealing_with_ambiguity', level: 3 },
          { slug: 'independence', level: 5 },
          { slug: 'python', level: 5 },
          { slug: 'react', level: 5 },
          { slug: 'mysql', level: 3 },
          { slug: 'docker', level: 5 },
          { slug: 'html', level: 4 },
          { slug: 'css', level: 4 },
          { slug: 'user_experience_design', level: 4 },
          { slug: 'user_interface_design', level: 4 }
        ],
        nextSteps: []
      }
    ]
  },
  {
    groupName: 'HR Management',
    relatedRoles: [
      {
        title: 'Talent Acquisition Specialist',
        coreSkills: [
          { slug: 'negotiating', level: 4 },
          { slug: 'budgeting', level: 3 },
          { slug: 'labor_law', level: 4 },
          { slug: 'onboarding', level: 3 },
          { slug: 'payroll', level: 1 },
          { slug: 'employer_branding', level: 3 },
          { slug: 'facilitation', level: 3 },
          { slug: 'hr_software', level: 3 },
          { slug: 'hr_strategy', level: 3 },
          { slug: 'hr_data', level: 3 },
          { slug: 'people_analytics', level: 3 },
          { slug: 'people_diagnostics', level: 3 },
          { slug: 'recruiting', level: 5 },
          { slug: 'talent_sourcing', level: 5 },
          { slug: 'project_management', level: 2 }
        ],
        nextSteps: ['HR Manager']
      },
      {
        title: 'HR Manager',
        coreSkills: [
          { slug: 'negotiating', level: 5 },
          { slug: 'budgeting', level: 4 },
          { slug: 'labor_law', level: 3 },
          { slug: 'onboarding', level: 3 },
          { slug: 'payroll', level: 3 },
          { slug: 'employer_branding', level: 4 },
          { slug: 'facilitation', level: 4 },
          { slug: 'hr_software', level: 3 },
          { slug: 'hr_strategy', level: 3 },
          { slug: 'hr_data', level: 2 },
          { slug: 'people_analytics', level: 3 },
          { slug: 'people_diagnostics', level: 4 },
          { slug: 'performance_management', level: 4 },
          { slug: 'recruiting', level: 4 },
          { slug: 'talent_sourcing', level: 3 },
          { slug: 'project_management', level: 3 }
        ],
        nextSteps: ['Senior HR Manager']
      },
      {
        title: 'Senior HR Manager',
        coreSkills: [
          { slug: 'negotiating', level: 5 },
          { slug: 'budgeting', level: 4 },
          { slug: 'labor_law', level: 3 },
          { slug: 'onboarding', level: 4 },
          { slug: 'payroll', level: 4 },
          { slug: 'employer_branding', level: 4 },
          { slug: 'facilitation', level: 5 },
          { slug: 'hr_software', level: 3 },
          { slug: 'hr_strategy', level: 4 },
          { slug: 'hr_data', level: 4 },
          { slug: 'people_analytics', level: 4 },
          { slug: 'people_diagnostics', level: 4 },
          { slug: 'performance_management', level: 5 },
          { slug: 'recruiting', level: 5 },
          { slug: 'talent_sourcing', level: 3 },
          { slug: 'project_management', level: 4 }
        ],
        nextSteps: []
      }
    ]
  }
]
