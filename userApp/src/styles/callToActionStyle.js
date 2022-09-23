import css from 'styled-jsx/css'
import variables from './variables'

export const callToActionStyle = css.global`
  .call-to-action__option-group {
    margin-bottom: 10px;
  }

  .call-to-action__option {
    display: flex;
    align-items: center;
    // cursor: not-allowed;
    opacity: 0.7;
    font-weight: 500;
    font-size: 12px;
  }

  .call-to-action__option--active {
    cursor: pointer;
    opacity: 1;
  }

  .call-to-action__option--active:hover {
    opacity: 0.7;
  }

  .call-to-action__option p {
    margin-left: 4px;
    display: block;
  }

  .call-to-action__option i {
    font-size: 20px;
  }

  @media ${variables.xs} {
    .call-to-action__option p {
      display: none;
    }

    .call-to-action__option i {
      font-size: 32px;
    }
  }
`
export default callToActionStyle
