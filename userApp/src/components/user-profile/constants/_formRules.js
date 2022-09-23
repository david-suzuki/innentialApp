export const growthRules = {
  neededWorkSkills: [
    {
      type: 'array',
      trigger: 'change',
      required: true,
      message: 'You must select at least one skill'
    },
    {
      validator: (rule, value, callback) => {
        if (value.length > 3) {
          callback(new Error('Please select up to three skills'))
        } else {
          callback()
        }
      }
    }
  ],
  selectedInterests: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value.length > 6) {
          callback(new Error('Please select up to six interests'))
        } else {
          callback()
        }
      }
    }
  ]
}

export const nameFormRules = {
  firstName: [{ required: true, message: 'Required', trigger: 'change' }],
  lastName: [{ required: true, message: 'Required', trigger: 'change' }]
}

export const passwordFormRules = state => ({
  oldPassword: [{ required: true, message: 'Required', trigger: 'change' }],
  password: [
    // TODO: Add more rules?
    { required: true, message: 'Required', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        const errors = []
        if (value.length < 8) {
          errors.push(new Error('Password must be at least 8 characters'))
        }
        callback(errors)
      }
    }
  ],
  passwordCheck: [
    { required: true, message: 'Required', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value !== state.passwordForm.password) {
          callback(new Error("Passwords don't match"))
        } else {
          callback()
        }
      }
    }
  ]
})
