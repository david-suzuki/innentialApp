export default (data, disabledNeededSkills = [], neededSkillsSelector) => {
  if (neededSkillsSelector) {
    const newData = JSON.parse(JSON.stringify(data))
    const disabledNeededSkillsIds = disabledNeededSkills.map(item => item._id)
    // console.log('newData: ', newData)
    return newData
      .filter(skill => skill.contentCount > 4 || skill.organizationSpecific)
      .filter(skill => !disabledNeededSkillsIds.includes(skill._id))
  }
  return data
}
