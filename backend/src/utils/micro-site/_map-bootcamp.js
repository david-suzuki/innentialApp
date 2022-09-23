const bootcampImg = {
  Careerfoundry:
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/careerfoundrylogo.jpg',
  'SPICED Academy':
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/spicedacademylogo.jpeg',
  'Wild Code School':
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/wildcodeschoollogo.png',
  LeWagon:
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/lewagonlogo.png',
  Ubiqum:
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/ubiqumlogo.png',
  Ironhack:
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/ironhacklogo.png',
  Codeworks:
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/codeworkslogo.jpg',
  'Code Academy Berlin':
    'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/codeacademylogo.png'
}

const options = [
  {
    description:
      'Pay off the course costs with a percentage of your future income',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/chancen-eg-logo.png',
    option: 'Income share'
  },
  {
    description: 'Up to 10,000€ of government support for job seekers',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/BfA-logo.png',
    option: 'Bildungsgutschein'
  },
  {
    description: "0% APR loan; start paying after you've started the course",
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/quotanda-logo.png',
    option: 'Quotanda'
  },
  {
    description: 'Pay 50% up front, 50% after you land a job',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/5050.png',
    option: '50/50'
  },
  {
    description:
      'Zero-interest loan of up to 10,000£ spread over 12 months with flexible repayments',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/knoma-logo.png',
    option: 'Knoma'
  },
  {
    description: 'Peer-to-peer loan platform for UK',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/lendwise-logo.png',
    option: 'Lendwise'
  },
  {
    description: '10% off when paying up front',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/descount.jpg',
    option: 'Discount'
  },
  {
    description:
      'Partial scholarships for residents of Southern and Eastern European countries',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/wildcodeschoollogo.png',
    option: 'Scholarships'
  },
  {
    description:
      'Pay a small deposit, then pay the rest with monthly installments once you land a job with a high enough salary',
    icon:
      'https://innential-production.s3.eu-central-1.amazonaws.com/micro-site/chancen-eg-logo.png',
    option: 'Pay when you get a job'
  }
]

const formatLookup = {
  'full-time': 'Full-time (8 hours/day)',
  'part-time': 'Part-time (4 hours/day)'
}

const mapBootcamps = bootcamps =>
  bootcamps.map(
    ({
      source,
      financing,
      bootcamp,
      duration,
      format,
      url,
      startsAt,
      remote,
      locations
    }) => {
      return {
        bootcamp,
        financing: options.filter(({ option }) =>
          financing.split(', ').includes(option)
        ),
        duration: String(duration)
          .split(', ')
          .map(d => `${d} weeks`)
          .join('/'),
        format: String(format)
          .split(', ')
          .map(f => formatLookup[f]),
        source: {
          name: source,
          iconSrc: bootcampImg[source]
        },
        url,
        startsAt,
        remote,
        locations: locations.split(', ')
      }
    }
  )

export default mapBootcamps
