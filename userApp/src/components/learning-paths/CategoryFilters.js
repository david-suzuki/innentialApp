import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { fetchLearningPathCategories } from '../../api'
import { BodyPortal } from '../ui-components'
import { ReactComponent as CrossIcon } from '../../static/cross-circle.svg'
import '../../styles/theme/notification.css'
import categoryFiltersStyle from '../../styles/categoryFiltersStyle'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Button, Checkbox, Dialog } from 'element-react'

const LPCategories = ({
  selectedCategories,
  handleSelectCategory,
  setListOrder = () => {},
  onboarding = false,
  hasRecommendedPaths
}) => {
  const { data, loading, error } = useQuery(fetchLearningPathCategories, {
    variables: {
      onboarding
    },
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (data?.fetchLearningPathCategories) {
      const listOrder = [
        hasRecommendedPaths ? 'Recommended Paths' : null,
        ...data?.fetchLearningPathCategories
      ].filter(i => !!i)
      setListOrder(listOrder)
    }
  }, [data, setListOrder])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <p>Oops! something went wrong</p>
  }

  const categories =
    [
      hasRecommendedPaths ? 'Recommended Paths' : null,
      ...data?.fetchLearningPathCategories
    ].filter(i => !!i) || []

  return categories.map((category, i) => (
    <div
      className='category-filters__checkbox'
      key={`category-filter:${i}:${category}`}
    >
      <Checkbox
        checked={selectedCategories.includes(category)}
        onChange={() => handleSelectCategory(category)}
      >
        {category}
      </Checkbox>
    </div>
  ))
}

const CategoryFilters = ({ categories = [], setCategories }) => {
  const [dialogVisible, setDialogVisible] = useState(false)

  const isSelected = category => {
    return categories.indexOf(category) !== -1
  }

  const handleSelectCategory = category => {
    if (isSelected(category)) {
      setCategories(categories.filter(c => c !== category))
    } else {
      setCategories([...categories, category])
    }
  }

  return (
    <>
      <div className='category-filters__desktop'>
        <div className='category-filters__heading'>
          <h2>Filters</h2>
          <Button type='text' onClick={() => setCategories([])}>
            Reset
          </Button>
        </div>
        <h4>Category</h4>
        <LPCategories
          selectedCategories={categories}
          handleSelectCategory={handleSelectCategory}
        />
      </div>

      <BodyPortal>
        <Dialog
          visible={dialogVisible}
          onCancel={() => setDialogVisible(false)}
          size='tiny'
        >
          <Dialog.Body>
            <LPCategories
              selectedCategories={categories}
              handleSelectCategory={handleSelectCategory}
            />
          </Dialog.Body>
        </Dialog>
        <div className='category-filters__mobile'>
          <Button
            className='el-button--green el-button--fixed'
            onClick={() => setDialogVisible(true)}
          >
            Filters <i className='icon icon-filter' />
          </Button>
        </div>
      </BodyPortal>
      <style>{categoryFiltersStyle}</style>
    </>
  )
}

export const CategoryFiltersOnboarding = ({
  categories = [],
  setCategories,
  hasRecommendedPaths
}) => {
  const [listOrder, setListOrder] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const isSelected = category => {
    return categories.indexOf(category) !== -1
  }

  const handleSelectCategory = category => {
    if (isSelected(category)) {
      setCategories(categories.filter(c => c !== category))
    } else {
      const newCategories = [...categories, category]
      newCategories.sort((a, b) => listOrder.indexOf(a) - listOrder.indexOf(b))
      setCategories(newCategories)
    }
  }

  useEffect(() => {
    const handleClickOutside = e => {
      if (!e?.target?.closest('#filter-dropdown') && dropdownVisible) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdownVisible, setDropdownVisible])

  return (
    <div className='category-filters__onboarding'>
      <div className='category-filters__onboarding__list'>
        <div
          className='category-filters__onboarding__filters'
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <i className='icon icon-filter' />
          <span className='category-filters__onboarding__filter__text'>
            Add filter
          </span>
          <i className='icon icon-small-down' />
        </div>
        {categories.map((category, i) => (
          <div
            className='category-filters__onboarding__selected'
            key={`selected-category:${i}:${category}`}
            onClick={() => handleSelectCategory(category)}
          >
            <CrossIcon />
            {category}
          </div>
        ))}
      </div>
      {dropdownVisible && (
        <div
          className='category-filters__onboarding__dropdown'
          id='filter-dropdown'
        >
          <LPCategories
            selectedCategories={categories}
            handleSelectCategory={handleSelectCategory}
            setListOrder={setListOrder}
            hasRecommendedPaths={hasRecommendedPaths}
            onboarding
          />
        </div>
      )}
      <style>{categoryFiltersStyle}</style>
    </div>
  )
}

export default CategoryFilters
