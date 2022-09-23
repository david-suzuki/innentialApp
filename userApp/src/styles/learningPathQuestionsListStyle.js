import css from 'styled-jsx/css'
import variables from '$/styles/variables'

export const learningPathQuestionsListStyle = css.global`
  .commentsList {
    background-color: ${variables.white};
    width: inherit;
  }

  .commentsList ul {
    list-style: none;
    padding: 1em 0;
  }
`

export default learningPathQuestionsListStyle
