import css from 'styled-jsx/css'
import variables from './variables'

export const statementStyle = css.global`
.statement {
  width: 100%;
  padding: 24px 39px 28px 26px;
  text-align: left;
  border-radius: 4px;
  background-color: ${variables.paleLilacTwo};
  position: relative;
}

/*
styles prepared to add collapse button as a first <div> in statement

<div className="statement__collapse">
Collapse <i className="icon icon-small-down" />
</div>

.statement__collapse {
  font-size: 11px;
  color: ${variables.duskyBlue};
  cursor: pointer;
  display: none;
}
@media ${variables.md} {
  .statement__collapse {
    display: block;
    position: absolute;
    top: 22px;
    right: 25px;
  }
}

.statement__collapse .icon.icon-small-down {
  font-size: 10px;
  transform: rotate(180deg);
}
*/


.statement__label {
  font-size: 12px;
  line-height: 0.9;
  color: ${variables.warmGreyTwo};
}

.statement__content {
  font-size: 12px;
  color: ${variables.black};
  position: relative;
  padding: 7px 0 7px 10px;
}
@media ${variables.md} {
  .statement__content {
    margin: 4px 0 13px 0;
  }
}

.statement__content:after {
  content: '';
  position: absolute;
  width: 2px;
  height: 40%;
  border-radius: 2px;
  background-color: ${variables.avocado};
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  z-index: 1;
}

.statement__date {
  font-size: 12px;
  line-height: 0.9;
  color: ${variables.duskyBlue};
}

.statement--hide {
  display: none;
}

.onboarding-statement {
  width: 100%;
  padding: 24px 16px 24px 20px;
  text-align: left;
  border-radius: 4px;
  background-color: #F6F8FC;
  position: relative;
  display: flex;
  align-items: center;
}

.onboarding-statement__title {
  font-weight: 700;
  font-size: 16px;
  color: ${variables.black};
  margin-bottom: 8px;
  position: relative;
}

.onboarding-statement__content {
  font-size: 14px;
  color: #556685;
  position: relative;
}
`
export default statementStyle
