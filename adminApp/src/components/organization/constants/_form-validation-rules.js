const formValidationRules = {
  organizationName: [
    {
      required: true,
      message: 'Please add Organization Name',
      trigger: 'blur'
    }
  ]
}

export default formValidationRules
