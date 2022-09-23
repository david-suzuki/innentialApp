import Avatar from 'avatar-initials'
import { getInitials, generatePseudoRandomColor } from './'

export const generateSpecialAvatar = ({
  initials,
  initialFg,
  initialBg,
  seed,
  initialSize,
  size,
  initialFontFamily,
  initialWeight
}) => {
  return Avatar.initialAvatar({
    initials: initials || '',
    initial_fg: initialFg || '#ffffff',
    initial_bg:
      initialBg ||
      generatePseudoRandomColor({
        seed: seed || 'a89sd8hyij1h'
      }),
    initial_size: initialSize || 68,
    size: size || 160,
    initial_font_family: initialFontFamily || 'Helvetica Neue',
    initial_weight: initialWeight || 500
  })
}

const generateInitialsAvatar = user => {
  // GENERATE INITIALS AVATAR FROM USER OBJECT
  return Avatar.initialAvatar({
    initials: getInitials(user),
    initial_fg: '#ffffff',
    initial_bg: generatePseudoRandomColor({
      // SEEDED RANDOM COLOR FROM ID
      seed: user?._id
    }),
    initial_size: 68,
    size: 160,
    initial_font_family: 'Helvetica Neue',
    initial_weight: 500
  })
}

export default generateInitialsAvatar
