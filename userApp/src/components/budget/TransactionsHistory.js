import React, { useEffect, useRef, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import transactionsHistoryStyle from '../../styles/transactionsHistoryStyle'
import TransactionStatus from './TransactionStatus'
import calendar from '$/static/calendar.svg'
import typeOfPurchase from '$/static/type.svg'
import provider from '$/static/provider.svg'
import approver from '$/static/approver.svg'
import euro from '$/static/euro.svg'
import chevronUp from '$/static/chevronUp.svg'
import udemy from '$/static/udemy.svg'
import blinkist from '$/static/blinkist.svg'
import ArrowLeft from '$/static/arrow-left.svg'
import LearningPathSuccess from '../ui-components/LearningPathSuccess'

const DUMMY_DATA = {
  expenses: [
    {
      id: 'p1',
      type_of_purchase: 'E-learning',
      provider: 'Udemy',
      approver: 'Jack Nicholson',
      date: '04/09/2021',
      amount: 129,
      status: 'Rejected',
      description:
        'Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)'
    },
    {
      id: 'p2',
      type_of_purchase: 'Book',
      provider: 'Blinkist',
      approver: 'Abraham Lincoln',
      date: '14/09/2021',
      amount: 19.99,
      status: 'Approved',
      description:
        'Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)'
    },
    {
      id: 'p3',
      type_of_purchase: 'Book',
      provider: 'Blinkist',
      approver: 'Lara Croft',
      date: '15/09/2021',
      amount: 19.99,
      status: 'Pending',
      description:
        'Budgeting: How to Make a Budget and Manage Your Money and Personal Finances Like a Pro (Budgeting, Money Management, Personal Finance, Planning Guide)'
    }
  ],
  budget: {
    remaining_budget: 1200.8,
    total_spent: 320,
    pending: 273,
    budget_level: 'success'
  }
}

const TransactionsHistory = ({ props = DUMMY_DATA }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [filter, setFilter] = useState('All')

  const ref = useRef()

  const filteredExpenses =
    filter === 'All'
      ? props.expenses
      : props.expenses.filter(item => {
          return item.status === filter
        })

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (showDropdown && ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [showDropdown])

  const toggleShowDropdownHandler = () => {
    setShowDropdown(prevState => !prevState)
  }

  const dropdownClickHandler = e => {
    setFilter(e.target.innerText)
    setShowDropdown(!showDropdown)
  }

  useEffect(() => {
    const mainOverlay = document.querySelector('#main-overlay')
    mainOverlay.classList.add('transactions-history')

    return () => {
    mainOverlay.classList.remove('transactions-history')
    }
  })

  const dropdown = (
    <div
      className='expenses__dropdown'
      onClick={dropdownClickHandler}
      ref={ref}
    >
      <span>Approved</span>
      <span>Pending</span>
      <span>Rejected</span>
    </div>
  )

  return (
    <>
      {/* <table className='expenses'>
        <tbody>
          <tr>
            <th className='expenses__header'>
              <img
                className='expenses__header_img'
                src={calendar}
                alt='calendar icon'
              />
              <span>Date</span>
            </th>
            <th className='expenses__header'>
              <img
                className='expenses__header_img'
                src={typeOfPurchase}
                alt='type of purchase icon'
              />
              <span>Type of purchase</span>
            </th>
            <th className='expenses__header'>
              <img
                className='expenses__header_img'
                src={provider}
                alt='provider icon'
              />
              <span>Provider</span>
            </th>
            <th className='expenses__header'>
              <img
                className='expenses__header_img'
                src={approver}
                alt='approver icon'
              />
              <span>Approver</span>
            </th>
            <th className='expenses__header'>
              <img
                className='expenses__header_img'
                src={euro}
                alt='euro icon'
              />
              <span>Amount</span>
            </th>
            <th className='expenses__header expenses__header_last'>
              <span style={{ paddingRight: '.5em' }}>Status</span>
              <span
                className={
                  showDropdown ? 'header__toggle--rotate' : 'header__toggle'
                }
              >
                <img
                  src={chevronUp}
                  alt='chevron down icon'
                  onClick={toggleShowDropdownHandler}
                />
              </span>
              {showDropdown && dropdown}
            </th>
          </tr>
          {filteredExpenses.map(expense => {
            return (
              <tr key={expense.id}>
                <td className='expenses__item'>{expense.date}</td>
                <td className='expenses__item'>
                  <span
                    className='expenses__item_tag'
                    gloss={expense.description}
                  >
                    {expense.type_of_purchase}
                  </span>
                </td>
                <td className='expenses__item'>
                  <img
                    src={expense.provider === 'Udemy' ? udemy : blinkist}
                    alt='provider logo'
                  />
                </td>
                <td className='expenses__item'>
                  <span className='expenses__item_approver'>
                    {expense.approver}
                  </span>
                </td>
                <td className='expenses__item'>{expense.amount.toFixed(2)}</td>
                <td className='expenses__item expenses__header_last'>
                  <TransactionStatus status={expense.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
        <style jsx>{transactionsHistoryStyle}</style>
      </table>
      <Link to='/' className='expenses__link'>
        <img src={ArrowLeft} alt='arrow to move back' />
        <span>Back To Home</span>
      </Link> */}
      <LearningPathSuccess pathName={'Async Communication'} />
    </>
  )
}

export default TransactionsHistory
