import css from 'styled-jsx/css'
import variables from './variables'

export const transactionsHistoryStyle = css.global`
.expenses {
  width: 100%;
  font-family: Poppins;
  background: #FAFAFD;
  letter-spacing: 0.008em;
  position: relative;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 1em;
}

.expenses td {  
  border-top: 1px solid #D9E1EE;
  padding: 1em 0;
}

.expenses__header {
  color: #3B4B66;
  font-weight: 400;
  font-size: .75em;
  line-height: 1.125em;
  text-align: left;
  padding-bottom: 0.3em;
}

.expenses__header_img {
  padding-right: 0.5em;
  height: auto;
  position: relative;
  top: 0.15em;
}

.header__toggle{
  cursor: pointer;
  display: inline-block;
  transition: transform .2s ease-in-out;
}

.header__toggle--rotate {
  cursor: pointer;
  display: inline-block;
  transform: rotate(180deg);
  transition: transform .2s ease-in-out;
}

.expenses__header_last {
  text-align: right;
  width: 10em;
}

.expenses__item {
  font-size: 0.875em;
  line-height: 1.375em;
  text-align: start;
}

.expenses__item_tag {
  color: ${variables.desaturatedBlue};
  font-size: .75em;
  font-weight: ${variables.bold700};
  line-height: 1.125em;
  padding: 0.375em;
  background: ${variables.hawkesBlue};
  border-radius: 4px;
  position: relative;
}

.expenses__item_tag:hover:after {
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  background: #FFF;
  box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1), 0px 16px 32px rgba(0, 8, 32, 0.1);
  border-radius: 4px;
  bottom: 10px;
  color: #556685;
  content: attr(gloss);
  right: -9em;
  padding: 6px 15px;
  position: absolute;
  z-index: 98;
  width: 23em;
}

.expenses__item_tag:hover:before {
  border: solid;
  border-color: ${variables.white} transparent;
  border-width: 6px 6px 0 6px;
  bottom: 4px;
  content: "";
  left: 40%;
  position: absolute;
  z-index: 99;
}

.expenses__item_approver {
  color: #6B66B3;
}

.expenses__dropdown {
  position: absolute;
  width: 7em;
  height: 7.3em;
  left: 92%;
  top: 2em;
  background: ${variables.white};
  font-size: 1em;
  line-height: 1.375em;
  padding: .5em;
  display: flex;
  flex-direction: column;
  gap: .8em;
  box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1), 0px 16px 32px rgba(0, 8, 32, 0.1);
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 10;
  cursor: pointer;
}

.expenses__link {
  color: ${variables.desaturatedBlue};
  font-size: 1em;
  letter-spacing: 0.008em;
  font-weight: ${variables.bold700};
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  margin-top: 1.4em;
}
`
export default transactionsHistoryStyle