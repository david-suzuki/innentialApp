import { Skills, SkillsRecommendation } from '../../models'

export const saveSurveyData = async ({ data }) => {
  const refsMap = {
    'e22da26f-185a-4827-82b8-0bbe5a8dec6c': ['storytelling', 'persuasion'],
    '37002dbb-450e-4ba8-bd45-a4060d0b0a94': ['agile_working', 'scrum'],
    '0139c989-4aad-406b-9ece-d7a6be48933a': ['data_literacy'],
    '052257ab-5dd3-4fa5-9a05-4b220731dbd4': [
      'affiliate_marketing',
      'cpa_marketing',
      'advertising_strategy'
    ],
    'e1299ce5-84d1-404b-af63-c5aed8bee702': [
      'communicating_effectively_in_a_team',
      'teamwork'
    ],
    '7343dab6-71b3-4525-9500-9d64f2bc0b98': [
      'teamwork',
      'collaboration',
      'remote_work'
    ],
    '383d9149-e6bc-4586-bca6-a0dc2823cbf3': ['deep_work', 'time_management'],
    '11ca3c84-4bb9-4997-b5a0-91097ff63128': ['stress_management'],
    '7a4d9189-c74a-4a95-8fbf-2b95a4694da9': [
      'kanban',
      'digital_project_management'
    ],
    'c7382e5a-c0a0-475e-979d-d1e60a63ffa6': [
      'innovating',
      'innovation_management'
    ],
    '3958a1c2-f6f2-4c0e-8396-55d7e887543b': ['deep_work', 'time_management'],
    'ff4b337e-66cf-4bc0-bb4c-c41e440d673e': [],
    '995e6812-4373-473d-940b-1eb6bae789f2': [
      {
        'Being a better HR Leader and Business Partner': [
          'people_development',
          'hr_strategy'
        ],
        'Developing people': ['people_development'],
        'Building a culture of learning and feedback': [
          'performance_management',
          'knowledge_sharing',
          'corporate_learning',
          'feedback_culture'
        ],
        'Knowledge sharing': ['people_development'],
        Other: []
      }
    ],
    'a6d9ac41-2897-4e3f-a03c-a16038419e87': [],
    'a146b0ed-b1d9-48b4-be67-68dcd4585247': [
      {
        'Communication with teammates': [
          'communicating_person_to_person',
          'communicating_effectively_in_a_team'
        ],
        'Onboarding new team members': ['onboarding', 'team_building'],
        'Motivating people around me': ['motivation'],
        'Gaining trust': ['managing_tasks_and_projects', 'project_leadership'],
        Other: []
      }
    ]
  }

  if (data) {
    const skillsMap = {}

    const userId = data.form_response.hidden.userid
    const answers = data.form_response.answers

    answers
      .filter(a => a.number > 3 || a.type === 'choices')
      .forEach(a => {
        const ref = a.field.ref
        const type = a.type

        if (type === 'number') {
          const score = a.number

          const skills = refsMap[ref]

          skills.forEach(skill => {
            skillsMap[skill] = skillsMap[skill]
              ? skillsMap[skill] + score
              : score
          })
        } else if (type === 'choices') {
          const response = a.choices.labels[0]

          let skills = refsMap[ref][0][response]
          if (skills === undefined) {
            skills = []
          }
          skills.forEach(skill => {
            skillsMap[skill] = skillsMap[skill] ? skillsMap[skill] + 1 : 1
          })
        }
      })

    const skillsArray = await Object.entries(skillsMap).reduce(
      async (acc, skill) => {
        const skillId = await Skills.findOne({
          slug: skill[0]
        })
          .select({ _id: 1 })
          .lean()

        // only consider those skills that exist in the DB
        if (skillId) {
          ;(await acc).push({ skillId, score: skill[1] })
        }

        return acc
      },
      []
    )

    const topSkills = skillsArray.sort((a, b) => b.score - a.score).slice(0, 6)

    await SkillsRecommendation.findOneAndUpdate(
      { userId },
      {
        $push: {
          history: {
            skills: topSkills
          }
        }
      },
      {
        returnOriginal: false,
        upsert: true
      }
    )
  }
}
