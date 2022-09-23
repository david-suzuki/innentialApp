const formValidationRules = {
  title: [
    {
      required: true,
      message: 'Please add content title',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: 'Please select the correct type',
      trigger: 'change'
    }
  ]
  // publishedDate: [
  //   {
  //     required: true,
  //     message: 'Please select correct content published date',
  //     trigger: 'change',
  //     type: 'date'
  //   }
  // ]
}

export default formValidationRules
