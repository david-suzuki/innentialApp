import React, { useState } from 'react'
import tabsStyle from '../../styles/tabsStyle'

const TabsList = ({
  children,
  onChange,
  activeTabIndex,
  setActiveTabIndex,
  noBorders,
  box,
  flex,
  maxWidth = 'none'
}) => {
  const getTabs = React.Children.map(children, (child, index) => {
    if (child) {
      return React.cloneElement(child, {
        tabIndex: index,
        active: activeTabIndex === index,
        onClick: () => {
          setActiveTabIndex(index)
          if (onChange) {
            onChange(index)
          }
        },
        noBorders,
        box
      })
    }
    return null
  })
  return (
    <div style={{ margin: '0 auto', maxWidth }}>
      <ul
        className={`tabs-list ${box ? 'tabs-list--box' : ''} ${
          flex ? 'tabs-list--flex' : ''
        } ${noBorders ? 'tabs-list--no-borders' : ''}`}
      >
        {getTabs}
      </ul>
    </div>
  )
}

const Tab = ({
  onClick,
  children,
  tabIndex,
  active,
  noBorders,
  disabled,
  box
}) => (
  <li
    className={`tabs-list-item ${active ? 'tabs-list-item--active' : ''} ${
      noBorders ? 'tabs-list-item--no-borders' : ''
    } ${disabled ? 'tabs-list-item--disabled' : ''} ${
      box ? 'tabs-list-item--box' : ''
    }`}
    onClick={!disabled ? () => onClick(tabIndex) : () => {}}
  >
    {children}
  </li>
)

const TabContent = ({ children }) => (
  <div className='tabs-content'>{children}</div>
)

const Tabs = ({
  children,
  onChange,
  initialActiveTabIndex,
  noBorders = false,
  className,
  box = false,
  flex = false,
  maxWidth,
  ...other
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialActiveTabIndex || 0
  )

  const getChildren = React.Children.map(children, (child, index) => {
    if (child && index === 0) {
      return React.cloneElement(child, {
        onChange,
        activeTabIndex,
        setActiveTabIndex,
        noBorders,
        box,
        flex,
        maxWidth
      })
    }

    if (child && activeTabIndex === index - 1) {
      return React.cloneElement(child)
    }

    return null
  })

  return (
    <div className={`tabs ${!className ? '' : className}`} {...other}>
      {getChildren}
      <style jsx>{tabsStyle}</style>
    </div>
  )
}

export { Tab, TabsList, TabContent, Tabs }
