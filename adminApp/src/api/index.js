export {
  connectionQuery,
  storeQuery,
  authQuery,
  fetchApiUrl,
  fetchAllLearningContent,
  fetchAllRatedLearningContent,
  fetchLearningContentRating,
  fetchLearningContent,
  fetchRelevantLearningContent,
  fetchAllSkills,
  fetchAllInterests,
  fetchAllIndustries,
  fetchAllLinesOfWork,
  fetchAllOrganizations,
  fetchOrganization,
  fetchAllUsers,
  fetchUsersListLength,
  fetchUser,
  publicFetchInvitation,
  fetchMembersCompleted,
  fetchLearningContentEditForm,
  fetchAllStageResults,
  fetchToolsForReport,
  fetchTeamLearningContent,
  fetchSkillEditForm,
  fetchRegularSkills,
  fetchOrganizationSkillsForAdmin,
  fetchAllContentSources,
  fetchSourceEditForm,
  fetchIconUploadLink,
  fetchSourcesListLength,
  fetchLearningContentListLength,
  fetchRatedLearningContentListLength,
  fetchAmountOfContentForSource,
  fetchOrganizationContentListLength,
  fetchOrganizationSpecificContent,
  fetchAmountOfContentForSkill,
  fetchSkillDeleteInfo,
  fetchSkillStats,
  fetchAllSkillCategories,
  fetchSkillCategoriesForOrganization,
  fetchCategoryDuplicateInfo,
  fetchDuplicateSkillInfo,
  fetchRegularSkillCategories,
  fetchAdminTeamContentStats,
  fetchFrameworkEditInfo,
  fetchAllRoles,
  fetchGoalsStatsForOrganization,
  fetchInnentialLearningPathStatistics,
  fetchLearningPathByIdAdmin,
  fetchOrganizationGoals,
  fetchOrganizationStatsGrowthData,
  fetchAllGrowthData,
  fetchOrganizationRequiredSkillData,
  fetchBannerUploadLink,
  fetchThumbnailUploadLink,
  fetchAuthorImageUploadLink,
  fetchAuthorCompanyLogoUploadLink,
  fetchAllFulfillmentRequests,
  fetchFulfillmentRequest,
  fetchInnentialAndOrgLearningPaths,
  fetchAllOrganizationsReduced,
  findUsers,
  fetchPDFUploadLink,
  fetchSkillBreakdown,
  fetchInnentialLearningPaths,
  fetchLearningPathStatistics,
  fetchInnentialLearningPathDetails,
  fetchLearningPathById
} from './_queries'

export {
  loginMutation,
  storeMutation,
  addLearningContent,
  addLearningContentFile,
  deleteLearningContent,
  editLearningContent,
  addOrganization,
  deleteOrganization,
  editOrganization,
  deleteUserFromOrganization,
  publicAcceptInvitation,
  addNewEmployee,
  addNewTeam,
  createTeamStageAssessment,
  fetchFormsAndMakeResult,
  addMember,
  deleteUserFromTeam,
  changeTeamLeader,
  addTeamLearningContent,
  toggleMembersGetReport,
  archiveTeam,
  deleteTeam,
  deleteUser,
  deleteTeamLearningContent,
  editSkill,
  deleteSpiderContent,
  disableSelectedSkills,
  addSkill,
  enableSelectedSkills,
  addSkillForOrganization,
  enableSelectedSkillsForOrganization,
  disableSelectedSkillsForOrganization,
  disableNeededSkillsForOrganization,
  enableNeededSkillsForOrganization,
  deleteSkillFromOrganization,
  addContentSource,
  editContentSource,
  enableSelectedSources,
  disableSelectedSources,
  deleteContentSource,
  removeSkill,
  addDemoOrganization,
  resetDemoOrganization,
  addSkillCategory,
  disableSelectedCategoriesForOrganization,
  enableSelectedCategoriesForOrganization,
  deleteCategoryFromOrganization,
  deleteCategory,
  renameCategory,
  resetCustomCategoryForSkill,
  setCustomCategoryForSkill,
  toggleWeeklyEmail,
  sendTestEmail,
  getUdemyCoursesForIDs,
  initializeNeededSkills,
  addFramework,
  editFramework,
  addFrameworkForOrganization,
  createRoleInOrganization,
  deleteRole,
  deleteFramework,
  toggleOrganizationIsPaying,
  cleanupDeadContent,
  deleteOrganizationLearningPathByAdmin,
  createLearningPath,
  updateLearningPath,
  changeLearningPathsStatus,
  activateOrganization,
  setOrganizationPremium,
  toggleOrganizationIsCorporate,
  makeMandatoryForOrganization,
  makeNotMandatoryForOrganization,
  toggleOrganizationFulfillment,
  fetchLearningContentIDBySource,
  generateCredentialsForLearning,
  completeFulfillmentRequest,
  setTeamRecommendedLearningPaths,
  transformLearningPathToGoalsAdmin,
  toggleOrganizationTechnicians,
  toggleOrganizationEvents
} from './_mutations'

export { defaults, resolvers } from './local-state'
