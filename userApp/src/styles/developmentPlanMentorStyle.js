import css from 'styled-jsx/css'
import variables from './variables'

const developmentPlanMentorStyle = css.global`
  .development-plan-mentor {
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 15px;
    border: solid 1px ${variables.warmGrey};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .development-plan-mentor__info-wrapper {
    display: flex;
  }

  .border-bottom {
    border: none;
    cursor: default;
    border-radius: 0px;
    box-shadow: none;
    border-bottom: solid 1px ${variables.whiteFour}};
  }

  .development-plan-mentor--selectable {
    border: solid 1px ${variables.brandPrimary};
  }

  .not-selected:hover {
    border: solid 1px ${variables.brandPrimary};
  }

  .not-selected {
    border: solid 1px ${variables.warmGrey};
  }

  .development-plan-mentor__image img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .development-plan-mentor__details {
    margin-left: 15px;
    text-align: left;
  }

  .development-plan-mentor__team {
    font-size: 10px;
    line-height: 0.9;
    color: ${variables.warmGreyTwo};
    margin: -5px 0 4px;
  }

  .development-plan-mentor__name {
    font-size: 12px;
    margin-bottom: 5px;
  }

  .development-plan-mentor__job {
    font-size: 10px;
    line-height: 0.9;
  }

  .user-item__review-completed-img {
    width: 22px;
    height: 22px;
    background-color: ${variables.brandPrimary};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .development-plan-mentor__skills-wrapper {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
  }

  .development-plan-mentor__skill-tag {
    font-size: 12px;
    color: ${variables.brandPrimary};
    padding: 4px 16px 3px;
    background: ${variables.paleLilacTwo};
    display: inline-block;
    border-radius: 11px;
    margin: 0 14px 8px 0;
    opacity: 0.3;
  }
  @media ${variables.lg} {
    .development-plan-mentor__skill-tag {
      margin-right: 14px;
    }
  }
  .development-plan-mentor__skill-tag--main {
    opacity: 1;
  }

  .development-plan-mentor__skill-tag-trim {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  .development-plan-mentor__skill-tag-trim:hover {
    max-width: none;
  }

  .development-plan-mentor__skill-tag-level {
    border-radius: 9px;
    background: ${variables.brandPrimary};
    color: white;
    padding: 3px 6px 2px;
    font-size: 9px;
    margin-right: -13px;
    margin-left: 6px;
    min-width: 25px;
    text-align: center;
  }

  .development-plan-mentor__skill-tag--skill {
    display: flex !important;
    align-items: center;
  }

  .development-plan-mentor__icons {
    color: ${variables.white};
    margin-left: auto;
  }

  .development-plan-mentor__icons i {
    font-weight: bold;
    background-color: ${variables.brandPrimary};
    padding: 3px;
    border-radius: 16px;
    margin-right: 10px;
  }
`

export default developmentPlanMentorStyle
