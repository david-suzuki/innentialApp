import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import dropdownBudgetStyle from "../../styles/dropdownBudgetStyle"
import { ReactComponent as ChevronDown } from '$/static/chevron-down.svg'
import { ReactComponent as ChevronRight } from '$/static/chevron-right.svg'
import { ReactComponent as IconActivity } from '$/static/activity.svg'
import { ReactComponent as IconBell } from '$/static/bell.svg'


const DUMMY_DATA = {
  expenses: [
    {
      id: "p1",
      type_of_purchase: "E-learning",
      provider: "Udemy",
      approver: 'Jack Nicholson',
      date: "04/09/2021",
      amount: 129,
      status: 'Rejected',
      description: "Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)",
    },
    {
      id: "p2",
      type_of_purchase: "Book",
      provider: "Blinkist",
      approver: 'Abraham Lincoln',
      date: "14/09/2021",
      amount: 19.99,
      status: 'Approved',
      description: "Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)",
    },
    {
      id: "p3",
      type_of_purchase: "Book",
      provider: "Blinkist",
      approver: 'Lara Croft',
      date: "15/09/2021",
      amount: 19.99,
      status: 'Pending Approval',
      description: "Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)",
    }],
  budget: {
    remaining_budget: 1200.80,
    total_spent: 320,
    pending: 273,
    budget_level: 'success',
  }
};

  
const DropdownBudget = (props) => {
	const [showDisplay, setShowDisplay] = useState(false);
		
	const location = useLocation()
  const pathname = location.pathname
 
	const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showDisplay && ref.current && !ref.current.contains(e.target)) {
        setShowDisplay(false);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [showDisplay]);

   const toggleShowDisplayHandler = () => {
    setShowDisplay(prevState => !prevState);
  };

  let budget_level;
  switch (props.budget.budget_level) {
		case "success":
			budget_level = 'header__amount header__amount_success';
			break;
		case "danger":
			budget_level = 'header__amount header__amount_danger';
			break;
		default:
			budget_level = 'header__amount header__amount_normal';
			break;
  };
 
  return (
    <div className='dropdown' ref={ref}>
      <div className='dropdown__header' onClick={toggleShowDisplayHandler}>
        <span className='header__title'>Your remaining budget:</span>
        <span className={budget_level}>
          {'\u20AC'} {props.budget.remaining_budget.toFixed(2)}
        </span>
        <span>
          <ChevronDown
            className={
              showDisplay ? 'header__chevron_rotate' : 'header__chevron'
            }
          ></ChevronDown>
        </span>
      </div>
      {showDisplay && (
        <div className='dropdown__display'>
          <div className='display__title'>Details</div>
          <div className='display__spendings'>
            <div className='spendings__item spendings__item_first'>
              <div>
                <IconActivity className='item__img'></IconActivity>
                <span>Total Spent</span>
              </div>
              <div className='spending__amount'>{'\u20AC'}320</div>
            </div>
            <div className='spendings__item'>
              <div>
                <IconBell className='item__img'></IconBell>
                <span>Pending approval</span>
              </div>
              <div className='spending__amount'>{'\u20AC'}273</div>
            </div>
          </div>
          <div className='display__list'>
            <table>
              <tbody>
                {props.expenses.map(spending => {
                  return (
                    <tr key={spending.id}>
                      <td>{spending.type_of_purchase}</td>
                      <td>{spending.provider}</td>
                      <td>{spending.date}</td>
                      <td>
                        {'\u20AC'} {spending.amount.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pathname !== '/transactions-history' && (
            <Link
              className='display__link'
              to='/transactions-history'
              onClick={toggleShowDisplayHandler}
            >
              <span>Show Transaction History</span>
              <span className='display__link display__link__img'>
                <ChevronRight
                  style={{
                    height: '2.3em'
                  }}
                />
              </span>
            </Link>
          )}
        </div>
      )}
      <style jsx>{dropdownBudgetStyle}</style>
    </div>
  )
}
 
export default DropdownBudget;

DropdownBudget.defaultProps = {
  expenses: DUMMY_DATA.expenses,
  budget: DUMMY_DATA.budget
}