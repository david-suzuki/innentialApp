export default {
  form: {
    title: '',
    url: '',
    author: '',
    type: 'ARTICLE',
    publishedDate: null,
    startDate: null,
    primarySkillName: '',
    relatedPrimarySkills: [],
    // relatedLineOfWork: {},
    price: {
      currency: 'EUR',
      value: 0
    }
    // relatedSecondarySkills: [],
    // relatedInterests: [],
    // relatedIndustries: []
  },
  pdfForm: {
    title: '',
    author: '',
    type: 'USER-CONTENT',
    publishedDate: new Date(),
    primarySkillName: '',
    relatedPrimarySkills: [],
    selectedFile: null,
    price: {
      currency: 'EUR',
      value: 0
    }
  },
  selectedPrimarySkills: []
}
