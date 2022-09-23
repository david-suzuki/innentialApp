import css from 'styled-jsx/css'
import variables from './variables'

const onboardingContentListStyle = css.global`
  .onboarding__learning-items-container {
    display: flex;
    justify-content: space-around;
  }

  @media ${variables.lg} {
    width: 822px;
  }

  .onboarding__learning-items-available {
    display: flex;
    width: 100%;
    /* min-width: 370px; */
  }
  .onboarding__learning-items-selected {
    display: none;
    /* min-width: 370px; */
  }
  .onboarding__learning-items-available,
  .onboarding__learning-items-selected {
    flex-direction: column;
  }

  @media ${variables.md} {
    margin: 24px;
  }

  @media ${variables.lg} {
    .onboarding__learning-items-selected {
      display: flex;
      /* width: 50%; */
      margin-right: 24px;
    }
    .onboarding__learning-items-available {
      width: 426px;
      /* width: 50%; */
    }
    .onboarding__learning-items-selected {
      width: 426px;
      /* width: 50%; */
    }

    .onboarding__learning-items-selected > div > div > h3 {
      padding: 5% 0px 70px;
    }
  }

  /* @media screen and (min-width: 1440px) {
    .onboarding__learning-items-available {
      width: 500px;
      /* width: 50%; */
  /*}
    .onboarding__learning-items-selected {
      width: 500px;
      /* width: 50%; */
  /* }
  }*/

  @media screen and (min-width: 1690px) {
    .onboarding__learning-items-available {
      width: 500px;
      /* width: 50%; */
    }
    .onboarding__learning-items-selected {
      width: 500px;
      /* width: 50%; */
    }
  }
`
export default onboardingContentListStyle
