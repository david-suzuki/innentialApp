import css from "styled-jsx/css";
import variables from "$/styles/variables";

export const learningPathQuestionsStyle = css.global`
  .learning-path__questions {
    width: 100%;
    text-align: left;
    padding-left: 70px;
    margin-bottom: 150px;
  }

  @media ${variables.md} {
    .learning-path__questions {
      width: 65%;
    }
  }

  .learning-path__questions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20.5px;
  }

  .learning-path__questions-title {
    font-size: 20px;
    font-weight: 800;
    border-bottom: 2px solid #5a55ab;
    display: flex;
    align-items: center;
    gap: .5em;
    padding-bottom: .8em;
  }

  .el-button--primary {
    
  }
  
  .el-button--primary span {
    font-size: 1em;
    font-weight: 700;
    display: flex:
    align-items: center;
    gap: .5em;
  }

`;

export default learningPathQuestionsStyle;
