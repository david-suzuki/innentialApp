const initialFormValues = {
  form: {
    title: '',
    url: '',
    author: '',
    type: '',
    publishedDate: null,
    relatedPrimarySkills: [
      {
        skillLevel: 1,
        importance: 3
      }
    ],
    relatedLineOfWork: {},
    price: {
      currency: 'EUR',
      value: ''
    },
    externalRating: null,
    nOfReviews: null,
    certified: false,
    duration: {
      basis: 'ONE TIME',
      hours: '',
      minutes: '',
      weeks: '',
      hoursMax: '',
      hoursMin: ''
    },
    relatedSecondarySkills: [],
    relatedInterests: [],
    relatedIndustries: []
  },
  selectedPrimarySkills: [
    {
      key: 0,
      value: [],
      skillLevel: 1,
      importance: 3
    }
  ],
  selectedSecondarySkills: [
    {
      key: 0,
      value: []
    }
  ],
  selectedInterests: [
    {
      key: 0,
      value: []
    }
  ],
  selectedIndustries: [
    {
      key: 0,
      value: []
    }
  ]
}

export default initialFormValues
