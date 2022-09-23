import css from 'styled-jsx/css'
import variables from './variables'

export const photoStyle = css.global`
  .photo {
    padding: 14px 0 8px 0;
    text-align: center;
  }
  .photo img {
    width: 76px;
    height: 76px;
    border-radius: 50%;
  }
  .photo__delete {
    color: ${variables.fadedRed};
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 6px;
  }

  .photo__delete:hover {
    opacity: 0.7;
  }
`
export default photoStyle
