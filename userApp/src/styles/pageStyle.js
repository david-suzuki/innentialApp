import css from 'styled-jsx/css'
import variables from './variables'

export const pageStyle = css.global`
  .page-container {
    display: flex;
    flex-direction: column;
    position: relative;
    /* justify-content: space-between; */
    /* margin-top: 2em; */
    /* min-height: 60vh; */
    /* min-height: 100vh; */
    height: auto;
    width: 90%;
    margin: 0 auto;
    padding: 50px 24px 60px;
    align-items: center;
    /* overflow-x: hidden; */
  }

  @media ${variables.lg} {
    .page-container {
      max-width: 960px;
      padding: 150px 95px 60px;
      align-items: flex-start;
      overflow-x: initial;
      margin: 0 24px;
    }

    .less-padding {
      padding: 150px 47px 60px;
    }
    .page-container h2,
    .page-container h4 {
      text-align: start !important;
    }

    /* .page-container h2 {
      padding-left: 3%;
    } */
  }

  @media screen and (min-width: 650px) {
    .development__title {
      text-align: start !important;
      margin-bottom: 12px !important;
    }
  }
  .development__subtitle {
    min-width: 300px;
    max-width: 700px;
    color: #979797;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 48px;
  }
  @media ${variables.xl} {
    .page-container {
      margin: 0 auto;
    }
  }

  .page-container h4 {
    text-align: center;
  }

  .page-container h2 {
    font-weight: 900;
    margin-bottom: 24px;
    text-align: center;
  }
  .form-group {
    margin-bottom: 1em;
  }

  .development-plan {
    padding: 50px 24px 24px;
  }

  @media ${variables.md} {
    .development-plan {
      padding: 50px 24px 60px;
    }
  }
`
export default pageStyle
