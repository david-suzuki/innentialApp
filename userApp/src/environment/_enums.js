/* eslint import/prefer-default-export: 0 */
export const VERSION = process.env.BUILD_DATE || ''

export const organizationSizeOptions = [
  {
    value: '1 - 20',
    label: '1 - 20'
  },
  {
    value: '21 - 50',
    label: '21 - 50'
  },
  {
    value: '51 - 100',
    label: '51 - 100'
  },
  {
    value: '101 - 200',
    label: '101 - 200'
  },
  {
    value: '201 - 500',
    label: '201 - 500'
  },
  {
    value: '501 - 1000',
    label: '501 - 1000'
  },
  {
    value: '1001 - 5000',
    label: '1001 - 5000'
  },
  {
    value: '5001 - 10000',
    label: '5001 - 10000'
  },
  {
    value: '10000 +',
    label: '10000 +'
  }
]
