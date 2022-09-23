import { ENVIRONMENT } from '../../environment'

const { SERVER } = process.env

const production = SERVER === ENVIRONMENT.PRODUCTION

const devFormDefinition = {
  id: 'pw0ctR',
  questions: [
    { id: 'U221SkddCoHx', key: 'engagement' },
    { id: 'EzGUXZjEXXsO', key: 'goalsManagement' },
    { id: 'AaZzfjpCBJK4', key: 'goalsManagement' },
    { id: 'WCeTorAKEjHW', key: 'independence' },
    { id: 'OrRefCP5cyjE', key: 'rolesClarity' },
    { id: 'IN1uUltmrKaR', key: 'rolesClarity' },
    { id: 'vZIhee0EZ5rF', key: 'structure' },
    { id: 't8QBGLQC8QRR', key: 'leadership' },
    { id: 'wVyZFOvHOPh0', key: 'comsAndFeedback' },
    { id: 'AvNJTyHvEVke', key: 'comsAndFeedback' },
    { id: 'CGQnExviTQFR', key: 'comsAndFeedback' },
    { id: 'n09eW9VamSQ2', key: 'comsAndFeedback' },
    { id: 'KOkOzGQFpcH0', key: 'planningAndDecisionMaking' },
    { id: 'ld1cgqVdYGik', key: 'planningAndDecisionMaking' },
    { id: 'A5PYqbA7vfk6', key: 'planningAndDecisionMaking' },
    { id: 'dIfJlZbGGQSJ', key: 'followUps' },
    { id: 'k1cQirV6n4Cv', key: 'planningAndDecisionMaking' },
    { id: 'JmRViDCb16xT', key: 'acceptanceAndNorms' },
    { id: 'VRoqbip1DBWK', key: 'acceptanceAndNorms' },
    { id: 'a7dyYEVgDRLG', key: 'acceptanceAndNorms' },
    { id: 'rW681QjNs0Bu', key: 'structure' },
    { id: 'UYXRTRKfUYjT', key: 'structure' },
    { id: 'UDF8DR0dWPY5', key: 'structure' },
    { id: 'cAAwBOeknCZe', key: 'cooperation' },
    { id: 'VDtqyonlgdzE', key: 'cooperation' },
    { id: 'yEQSFmzOS21r', key: 'cooperation' },
    { id: 'zYAEmb1jicYP', key: 'text' },
    { id: 'FdjJh8kJ5O95', key: 'text' }
  ]
}

const productionFormDefinition = {
  id: 'EWE23v',
  questions: [
    { id: 'hZLIbJG8KuFz', key: 'engagement' },
    { id: 'xXamAtuexfNm', key: 'goalsManagement' },
    { id: 'vGTkNiRoXFMt', key: 'goalsManagement' },
    { id: 'YFQZlKFkjxD5', key: 'independence' },
    { id: 'OSuT7vfFXJ5p', key: 'rolesClarity' },
    { id: 'cstjWpbMpjIw', key: 'rolesClarity' },
    { id: 'xc7i7VomyKO7', key: 'structure' },
    { id: 'mONpmE1eiFyj', key: 'leadership' },
    { id: 'wWqSX0LuM0kE', key: 'comsAndFeedback' },
    { id: 'MpTjakosd1HX', key: 'comsAndFeedback' },
    { id: 'MOkRu9T1RYLv', key: 'comsAndFeedback' },
    { id: 'AJpm4jBQV8pj', key: 'comsAndFeedback' },
    { id: 'Xadl6QZsYoqH', key: 'planningAndDecisionMaking' },
    { id: 'BRFtk0t3tvIB', key: 'planningAndDecisionMaking' },
    { id: 'mwRfS1OGFIfP', key: 'planningAndDecisionMaking' },
    { id: 'u5Rd40mmDsuj', key: 'followUps' },
    { id: 'UmkEwXHzQbcD', key: 'planningAndDecisionMaking' },
    { id: 'H2D6rLXJaHRI', key: 'acceptanceAndNorms' },
    { id: 'YLe2GEPeVnst', key: 'acceptanceAndNorms' },
    { id: 'hgRM51mknXuv', key: 'acceptanceAndNorms' },
    { id: 'K1rXNEBPNpr9', key: 'structure' },
    { id: 'OUagFhsgbK9G', key: 'structure' },
    { id: 'ixT3s0GcDd2m', key: 'structure' },
    { id: 'aknTdO09NLXA', key: 'cooperation' },
    { id: 'MJtGWg4kH2iQ', key: 'cooperation' },
    { id: 'I4fpHcbusFZ2', key: 'cooperation' },
    { id: 'rjEnPFdLEaqu', key: 'text' },
    { id: 'KojftHNyM5k7', key: 'text' }
  ]
}

export const typeform = {
  formDefinition: production ? productionFormDefinition : devFormDefinition,
  innentialFbUrl: production
    ? 'https://europe-west1-innential-production.cloudfunctions.net/handleRequests'
    : 'https://europe-west1-innential-staging.cloudfunctions.net/handleRequests'
}

export const areaLabelAndTip = performanceAreas => {
  return performanceAreas.map(area => {
    let label = ''
    let tip = ''
    switch (area) {
      case 'goalsManagement':
        label = 'Goals Management'
        tip =
          'Together with the team develop methods to manage the goals effectively. Ensure that goals are clear to everybody and that all the members agree with them.'
        break
      case 'independence':
        label = 'Interdependence'
        tip =
          'Revise methods how team members organise themselves and work together and in smaller groups. Explore and discuss dependencies and synergies.'
        break
      case 'rolesClarity':
        label = 'Roles Clarity'
        tip =
          'Make sure that the tasks are clearly defined and assigned to the most competent people. Increase awareness of individual skills, experiences and preferences.'
        break
      case 'structure':
        label = ' Structure'
        tip =
          'Revise how the team can improve division of work. Raise awareness of skills and competencies among members and then optimise the structure for each project.'
        break
      case 'leadership':
        label = 'Leadership'
        tip =
          'Discuss the needs and expectations of your team towards you. Raise your awareness on how your leadership style should adapt according to Stage your team is at. '
        break
      case 'comsAndFeedback':
        label = 'Communication and Feedback'
        tip =
          'Launch and develop an open communication structure and ensure that everybody participates. Choose appropriate feedback approaches for your team.'
        break
      case 'planningAndDecisionMaking':
        label = 'Discussion, Decision Making, Planning'
        tip =
          'Develop methods of planning, decision making and ensure you assign enough time for a team discussion and that the entire team feels comfortable about it.'
        break
      case 'followUps':
        label = 'Follow-up from decision to implementation'
        tip =
          'Develop methods to monitor follow-ups in the team. Revisit your latest projects to discuss with the team the good and bad examples of follow-ups.'
        break
      case 'acceptanceAndNorms':
        label = 'Norms and Acceptance to different behaviours'
        tip =
          'Develop clarity whether your norms encourage high performance, quality and success. Clarify whether all the team members feel they are granted personal freedom.'
        break
      case 'cooperation':
        label = 'Cooperation and Conflict Management'
        tip =
          'Develop effective conflict management techniques and revise your working processes. Make sure all the members understand and agree to them.'
        break
    }

    return {
      label,
      tip
    }
  })
}
