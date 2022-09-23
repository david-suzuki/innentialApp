import { useState, useReducer, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import {
  reducer,
  initialFilterState
} from './components/learning-content/components/filters'

/* eslint-disable */
const container = ({
  initialFramework = {
    visible: false,
    frameworkId: null,
    level: 0,
    skillName: ''
  },
  firstName = '',
  lastName = '',
  roleAtWork = '',
  roleId = null,
  selectedWorkSkills = []
  // technicianOnboarding = false
  // initialWorkInfoState = {
  //   roleAtWork: '',
  //   roleId: null,
  //   selectedWorkSkills: []
  // }
}) => {
  const initialOnboarding = {
    firstName,
    lastName,
    roleAtWork: {
      _id: roleId,
      title: roleAtWork || ''
    },
    // technician: technicianOnboarding,
    contentSeen: [],
    selectedWorkSkills,
    neededWorkSkills: [],
    survey: false,
    // filters: {
    //   price: [],
    //   priceRange: {
    //     minPrice: 0,
    //     maxPrice: 100
    //   },
    //   maxDuration: 6,
    //   preferredCertified: []
    // },
    developmentPlan: [],
    framework: {
      frameworkId: null,
      level: 0,
      skillName: ''
    }
  }

  const initialNextStep = {
    contentSeen: [],
    developmentPlan: []
  }

  // const [preferencesState, setPreferencesState] = useState(initialPreferences)
  const [frameworkState, setFrameworkState] = useState(initialFramework)

  // let [isViewingPeople, setViewingPeople] = useState(initialState)
  // let [isOnContentUpload, setOnContentUpload] = useState(null)
  const [isSharingContent, setSharingContent] = useState(false)
  const [isUnsharingContent, setUnsharingContent] = useState(false)
  const [isRecommendingContent, setRecommendingContent] = useState(false)
  const [isAssigningPath, setAssigningPath] = useState(null)
  const [sharedContent, setSharedContent] = useState(null)
  // let [profileActiveTab, setProfileActiveTab] = useState('Skills')
  // let [isSelectingSkills, setSelectingSkills] = useState(false)
  // let [focusedSkillFrameworkId, setFocusedSkillFrameworkId] = useState('')
  // let [focusedSkillFrameworkLevel, setFocusedSkillFrameworkLevel] = useState(0)
  // let [focusedSkillName, setFocusedSkillName] = useState('')
  // let [shouldSeeFramework, setSeeFramework] = useState(false)
  // let [isEdittingPlan, setEdittingPlan] = useState(false)
  const [onboardingState, setOnboardingState] = useState(initialOnboarding)

  const [displayFilters, setDisplayFilters] = useState(false)
  const [prevNeededSkills, setPrevNeededSkills] = useState([])
  const [neededSkills, setNeededSkills] = useState([])
  const [extraSkills, setExtraSkills] = useState([])
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [inDPSetting, setInDPSetting] = useState(false)
  const [filters, filtersDispatch] = useReducer(reducer, initialFilterState)
  const [fetchMoreSearched, setFetchMoreSearched] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [noMoreSearchedContent, setNoMoreSearchedContent] = useState(false)

  const [addedContent, setAddedContent] = useState(null)
  const [isAddingToGoal, setAddingToGoal] = useState(false)
  const [addedContentLoading, setAddedContentLoading] = useState(false)

  const [contentSeen, setContentSeen] = useState(initialNextStep.contentSeen)
  const [developmentPlan, setDevelopmentPlan] = useState(
    initialNextStep.developmentPlan
  )

  const [continued, setContinue] = useState(false)
  const [nextStepTab, setNextStepTab] = useState(0)

  const resetNextStepState = () => {
    setContentSeen(initialNextStep.contentSeen)
    setDevelopmentPlan(initialNextStep.developmentPlan)
    setContinue(false)
    setNextStepTab(0)
  }

  useEffect(() => {
    // PREVENT FILTERS BEING CLEARED WHEN ACCESSING DEVELOPMENT PLAN SETTING MULTIPLE TIMES
    if (JSON.stringify(neededSkills) !== JSON.stringify(prevNeededSkills)) {
      filtersDispatch({ type: 'CLEAR_FILTERS' })
    }
    setPrevNeededSkills(neededSkills)
  }, [neededSkills, prevNeededSkills, setPrevNeededSkills])

  // useEffect(() => {
  //   console.log(isAssigningPath)
  // }, [isAssigningPath])

  const [openRoleTabs, setOpenRoleTabs] = useState([0])

  const handleToggleRoleTab = index => {
    if (openRoleTabs.some(i => i === index)) {
      setOpenRoleTabs(openRoleTabs.filter(i => i !== index))
    } else {
      setOpenRoleTabs([...openRoleTabs, index])
    }
  }

  const [openPathTabs, setOpenPathTabs] = useState([0])

  const handleTogglePathTab = index => {
    if (openPathTabs.some(i => i === index)) {
      setOpenPathTabs(openPathTabs.filter(i => i !== index))
    } else {
      setOpenPathTabs([...openPathTabs, index])
    }
  }

  /* ONBOARDING FUNCTIONS */

  const setFocusedFramework = (frameworkId, level, skillName) => {
    setOnboardingState({
      ...onboardingState,
      framework: {
        frameworkId,
        level,
        skillName
      }
    })
  }

  const handleOnboardingChange = (value, key) => {
    // const { form } = onboardingState
    setOnboardingState({
      ...onboardingState,
      [key]: value
    })
  }

  // const handleSuggestRole = (value) => {
  //   const { form } = onboardingState
  //   setOnboardingState({
  //     ...onboardingState,
  //     form: {
  //       ...form,
  //       roleAtWork: value,
  //       suggestRole: true
  //     }
  //   })
  // }

  // const onSkillsChange = (value, relatedSkill, formKey) => {
  //   const newSelectedSkills = [...onboardingState.form[formKey]]
  //   if (
  //     newSelectedSkills.length &&
  //     !newSelectedSkills.find(item => item._id === value[1])
  //   ) {
  //     newSelectedSkills.push({ ...relatedSkill, level: 0 })
  //   } else if (!newSelectedSkills.length) {
  //     newSelectedSkills.push({ ...relatedSkill, level: 0 })
  //   }

  //   const { form } = onboardingState
  //   setOnboardingState({
  //     ...onboardingState,
  //     form: {
  //       ...form,
  //       [formKey]: [...newSelectedSkills]
  //     }
  //   })
  // }

  const checkSkillInArray = stateSkills => {
    return skill =>
      !stateSkills.some(sk => {
        const id1 = sk.skillId || sk._id
        const id2 = skill.skillId || skill._id

        return id1 === id2
      })
  }

  const onSkillsSubmit = (skills, key, noLevel) => {
    const stateSkills = onboardingState[key]
    if (Array.isArray(stateSkills))
      setOnboardingState({
        ...onboardingState,
        [key]: [
          ...skills
            .filter(checkSkillInArray(stateSkills))
            .map(sk => ({ ...sk, level: noLevel ? NaN : 0 })),
          ...stateSkills
        ]
      })
  }

  const removeSkill = (e, id, key) => {
    const newSkills = onboardingState[key].filter(skill => {
      const skillId = skill.skillId || skill._id
      return skillId !== id
    })

    setOnboardingState({
      ...onboardingState,
      [key]: [...newSkills]
    })
  }

  const setSkillLevel = (name, level, key) => {
    const newSkills = onboardingState[key].reduce((acc, curr) => {
      if (curr.name === name) {
        return [...acc, { ...curr, level }]
      } else {
        return [...acc, { ...curr }]
      }
    }, [])

    setOnboardingState({
      ...onboardingState,
      [key]: [...newSkills]
    })
  }

  const appendContentSeen = impression => {
    setOnboardingState({
      ...onboardingState,
      contentSeen: [...onboardingState.contentSeen, ...impression]
    })
  }

  const setContentSeenOnboarding = value => {
    setOnboardingState({
      ...onboardingState,
      contentSeen: value
    })
  }

  const isSelected = ({ _id }) => {
    return onboardingState.developmentPlan.some(
      ({ _id: contentId }) => contentId === _id
    )
  }

  const developmentPlanHandler = content => {
    const { developmentPlan } = onboardingState
    setOnboardingState({
      ...onboardingState,
      developmentPlan: !isSelected(content)
        ? [content, ...developmentPlan]
        : [...developmentPlan.filter(({ _id }) => _id !== content._id)]
    })
  }

  const clearDevelopmentPlan = () => {
    setOnboardingState({
      ...onboardingState,
      developmentPlan: []
    })
  }

  // const onInterestChange = (value, relatedInterest) => {
  //   const newSelectedInterests = [...onboardingState.form.selectedInterests]
  //   if (
  //     newSelectedInterests.length &&
  //     !newSelectedInterests.find(item => item._id === value)
  //   ) {
  //     newSelectedInterests.push(relatedInterest)
  //   } else if (!newSelectedInterests.length) {
  //     newSelectedInterests.push(relatedInterest)
  //   }

  //   const { form } = onboardingState

  //   setOnboardingState({
  //     ...onboardingState,
  //     form: {
  //       ...form,
  //       selectedInterests: [...newSelectedInterests]
  //     }
  //   })
  // }

  // const onInterestRemove = (e, interestId) => {
  //   e.preventDefault()
  //   const newSelectedInterests = onboardingState.form.selectedInterests.reduce(
  //     (acc, curr) => {
  //       if (curr._id === interestId) return [...acc]
  //       else {
  //         return [
  //           ...acc,
  //           {
  //             ...curr
  //           }
  //         ]
  //       }
  //     },
  //     []
  //   )

  //   const { form } = onboardingState

  //   setOnboardingState({
  //     ...onboardingState,
  //     form: {
  //       ...form,
  //       selectedInterests: [...newSelectedInterests]
  //     }
  //   })
  // }

  return {
    onboardingState,
    onboardingFunctions: {
      setFocusedFramework,
      handleOnboardingChange,
      onSkillsSubmit,
      removeSkill,
      setSkillLevel,
      appendContentSeen,
      isSelected,
      developmentPlanHandler,
      clearDevelopmentPlan,
      setContentSeen: setContentSeenOnboarding
      // handleSuggestRole,
      // onSkillsChange,
      // onChangeSlider,

      // onInterestChange,
      // onInterestRemove
    },

    // preferencesState,
    // setPreferencesState,
    frameworkState,
    setFrameworkState,

    // isViewingPeople,
    // setViewingPeople,
    // isOnContentUpload,
    // setOnContentUpload,
    // profileActiveTab,
    // setProfileActiveTab,
    isSharingContent,
    setSharingContent,
    sharedContent,
    setSharedContent,
    isUnsharingContent,
    setUnsharingContent,
    isRecommendingContent,
    setRecommendingContent,
    isAssigningPath,
    setAssigningPath,
    openRoleTabs,
    handleToggleRoleTab,
    neededSkills,
    setNeededSkills,
    filters,
    filtersDispatch,
    user,
    setUser,
    displayFilters,
    setDisplayFilters,
    search,
    setSearch,
    inDPSetting,
    setInDPSetting,
    extraSkills,
    setExtraSkills,
    fetchMoreSearched,
    setFetchMoreSearched,
    loadingMore,
    setLoadingMore,
    noMoreSearchedContent,
    setNoMoreSearchedContent,
    openPathTabs,
    handleTogglePathTab,
    addedContent,
    setAddedContent,
    isAddingToGoal,
    setAddingToGoal,
    addedContentLoading,
    setAddedContentLoading,
    continued,
    setContinue,
    nextStepTab,
    setNextStepTab,
    contentSeen,
    setContentSeen,
    developmentPlan,
    setDevelopmentPlan,
    resetNextStepState
    // isSelectingSkills,
    // setSelectingSkills,
    // focusedSkillFrameworkId,
    // setFocusedSkillFrameworkId,
    // focusedSkillFrameworkLevel,
    // setFocusedSkillFrameworkLevel,
    // focusedSkillName,
    // setFocusedSkillName,
    // shouldSeeFramework,
    // setSeeFramework,
    // isEdittingPlan,
    // setEdittingPlan
  }
}

const Container = createContainer(container)

export default Container
