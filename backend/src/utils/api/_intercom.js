import { JourneyNextSteps, User } from '../../models'

export const handleIntercomHook = async ({ data, topic }) => {
  if (topic !== 'user.tag.created') return

  const {
    item: {
      user: { user_id: user /*, email */ },
      tag
    }
  } = data

  const nextStep = await JourneyNextSteps.findOne({ user })

  if (!nextStep) {
    await JourneyNextSteps.create({ user })
  }

  switch (tag.name) {
    case 'awaiting xlp':
      await JourneyNextSteps.findOneAndUpdate(
        { user },
        {
          $set: {
            awaitingXLP: true
          }
        }
      )
      return
    default:
      const userData = await User.findOneAndUpdate(
        { _id: user },
        { $set: { status: 'active' } }
      )

      if (!userData) throw new Error(`User with ID:${user} does not exist`)
  }
}
