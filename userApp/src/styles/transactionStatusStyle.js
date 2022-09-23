import css from 'styled-jsx/css'
import variables from './variables'

export const transactionStatusStyle = css.global`
.transactionStatus {
  font-size: .75em;
  font-weight: 700;
  line-height: 1.125em;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  gap: .8em;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 9px;
  width: fit-content;
  float: right;
}

.transactionStatus--reject {
  color: #BA0913;
  border: 1px solid #BA0913;
}

.transactionStatus--approved {
  color: #128945;
  border: 1px solid #128945;
}

.transactionStatus--pending {
  color:  #FEBB5B;
  border: 1px solid #FEBB5B;
}

.transactionStatus--reject-circle {
  background: #BA0913;
}

.transactionStatus--approved-circle {
  background: #128945;
}

.transactionStatus--pending-circle {
  background:  #FEBB5B;
}

.transactionStatus__circle {
  width: .75em;
  height: .75em;
  border-radius: 50%;
}
`
export default transactionStatusStyle