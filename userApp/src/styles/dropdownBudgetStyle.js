import css from 'styled-jsx/css'
import variables from './variables'

export const dropdownBudgetStyle = css.global`
.dropdown {
  position: relative;
  margin-left: auto;
  cursor: pointer;
}

.dropdown__header {
  font-size: 0.65em;
  font-weight: ${variables.bold};
  line-height: 1.375em;
  letter-spacing: 0.008em;
  float: right;
  padding-right: 1em;
}

.dropdown__display {
  font-size: 0.57em;
  font-weight: ${variables.regular};
  line-height: 1.125em;
  background-color: ${variables.white};
  border: 1px solid ${variables.hawkesBlue};
  box-sizing: border-box;
  border-radius: 4px;
  padding-inline: 1.28em;
  position: absolute;
  width: 30.8em;
  top: 4.5em;
  right: 0;
  z-index: 10;
  box-shadow: 0px 6px 7px 1px ${variables.hawkesBlue};
}

.dropdown__display:before{
 content:'';
 display: block;
 height: 1.2em;
 width: 1.2em;
 background-color: inherit;
 border: inherit;
 position: relative;
 bottom: 0.596em;
 left: calc(97% - 5px);
 -webkit-clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
         clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
 transform: rotate(135deg);
 border-radius: 0 0 0 0.25em;
}

.header__amount {
  padding-inline: 0.75em;  
}

.header__amount_success {
  color: ${variables.deepGreen};
}

.header__amount_danger {
  color: ${variables.darkRed};
}

.header__amount_normal {
  color: ${variables.black};
}

.header__chevron {
  cursor: pointer;
  display: inline-block;
  height: .65em;
  width: auto;
  transition: transform .2s ease-in-out;
}

.header__chevron_rotate {
  cursor: pointer;
   display: inline-block;
  height: .65em;
  width: auto;
  transform: rotate(180deg);
  transition: transform .2s ease-in-out;
}

.display__title {
  margin: 0;
  border-bottom: 1px solid ${variables.hawkesBlue};
  padding: 0.5em 0;
}

.display__spendings {
  border-bottom: 1px solid ${variables.hawkesBlue};
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: .5em;
}

.spendings__item {
  display: flex;
  justify-content: space-between;
  padding: 0.4em 0;
  align-items: self-end;
}

.spendings__item_first {
  padding-top: .8em;
}

.item__img{
  padding-right: 0.5em;
  position: relative;
  top: 0.25em;
  width: auto;
}
.spending__amount {
  font-weight: 700;
}

.display__list table {
  padding: .3em 0;
  width: 100%;
}

.display__list table tr td{
  padding: .4em 0;
}

.display__list table tr td:last-child{
  text-align: right;
}

.display__list table tr td:nth-child(3) {
  color: ${variables.darkBlueTwo};
  text-align: right;
}

.display__link {
  color: ${variables.brandPrimary};
  font-size: 0.825em;
  font-weight: ${variables.bold};
  line-height: 1em;
  letter-spacing: 0.008em;
  display: flex;
  align-items: center;
  padding-bottom: 1.3em;
}

.display__link__img {
  position: relative;
  top: .6em;
}
`
export default dropdownBudgetStyle