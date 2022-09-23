import templateStyle from './_templateStyle'
import outlookResetStyles from './_outlookResetStyles'

const capitalize = str => {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const placeholderLink =
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
const [articleLink, bookLink, courseLink, toolLink] = [
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/article.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/book.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/collection.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/tool.png'
]
const [thumbLink, glassLink, chartLink, wrenchLink] = [
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/pushpin_1f4cc.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/magnifying-glass-tilted-right_1f50e.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/chart-increasing_1f4c8.png',
  'https://innential-production.s3.eu-central-1.amazonaws.com/email/wrench_1f527.png'
]

/* THESE ARE MAPPED HTML COMPONENTS TO BE USED IN BUILDING EMAILS */
export const mapNoteParagraph = ({ content }) => {
  return `
    <tr>
      <td>
        <div style="text-align: justify;">
          <div style="padding: 20px; border: 1px solid #e8e8e8">
            ${content}
          </div>
        </div>
      </td>
    </tr>
  `
}

export const mapUserSkills = ({ skills }) => {
  return `
    <tr>
      <td valign="top" class="mcnTextBlockInner" style="padding: 10px 0" align="center">
        <table>
          <tr>
            ${skills
              .map(
                skill => `
              <td>
                <div style="font-size: 11px; color: #5a55ab; padding: 5px 10px; margin: 5px; border-radius: 3px; background: rgba(231, 230, 255, 0.6);">${skill}</div>
              </td>
            `
              )
              .join(' ')}
          </tr>
        </table>
      </td>
    </tr>
  `
}

export const mapDivider = () => `
  <tr>
    <td bgcolor="#ffffff">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <tr>
                        <td align="center" valign="middle">
                            <table width="184" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td height="25" style="border-bottom: 2px solid #D9E1EE;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="30" align="center" valign="top">&nbsp;</td>
                                </tr>
                                </tbody>
                            </table>
                      </td>
                    </tr>
                </tr>
            </tbody>
        </table>
    </td>
  </tr>
`

export const mapActivePath = ({
  // _id: goalId,
  label,
  pathName,
  imgLink = 'https://via.placeholder.com/880x510',
  goals,
  // NCompleted,
  // NAll,
  lastChild
  // dueDate,
  // appLink
}) => {
  return `
    <tr>
      <td valign="top" style="${
        lastChild ? '' : ' border-bottom: 1px solid; border-color: #e8e8e8;'
      }" >
        <table width="100%"  border="0" cellspacing="0" cellpadding="0" >
          <tr>
          ${
            imgLink
              ? `
                <td style="width: 33%;">
                  <div
                    style="width: 145px; height: 145px; background-size: auto 145px; background-position: center; background-image: url('${imgLink}'); margin: 0 auto;"
                  />
                </td>
              `
              : ''
          }
            <td style="background-color: #f7f7ff; padding: 0px 10px 0px 30px;">
              <div>
                <p style="font-size: 12px; color: #979797;">${label}</p>
                <div>
                  <div style="font-size: 18px; font-weight: bold; padding-bottom: 10px">
                    ${pathName}
                  </div>
                </div>
                ${
                  goals.length > 1
                    ? `
                  <div>
                  <table width="100%"  border="0" cellspacing="0" cellpadding="0" >
                    <tr>
                      <td width="40%">
                        <p style="font-size: 14px; color: #979797;">Goal Progress</p>
                      </td>
                      ${goals
                        .map((status, i) => {
                          const colors = {
                            ACTIVE: '#d8d8d8',
                            SELECTED: '#5a55ab',
                            PAST: '#b9dee2'
                          }
                          const color = colors[status]
                          return `
                          <td width="${60 / goals.length}%">
                            <div style="margin: 0 auto; text-align: center; font-size: 18px; color: #ffffff; font-weight: bold; width: 26px; height: 26px; line-height: 22px; box-sizing: border-box; background-color: ${color}; border: 2px solid #fff">${i +
                            1}</div>
                          </td>
                        `
                        })
                        .join('')}
                    </tr>
                  </table>
                  </div>
                  `
                    : ''
                }
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  // ${
  //   appLink && goalId
  //     ? `
  //   <tr>
  //     <th colspan="2" style="background-color: #f7f7ff; padding: 0px 10px 24px 30px; font-weight: normal; text-align: left;">
  //       <a href="${appLink}/plan/${goalId}" style="color: #5a55ab;">See more</a>
  //     <th/>
  //   </tr>
  // `
  //     : ''
  // }

  // ${
  //   NAll > 0
  //     ? `
  //   <td align="right" style="background-color: #f7f7ff; padding: 10px 10px 10px 30px;">
  //     <div class="currently-working__numbers" style="width: 50px; text-align: center; margin-right: 20px; color: #979797; font-size: 10px; font-family: Poppins, sans-serif; mso-font-alt: Arial, Helvetica, sans-serif !important;">
  //       <p style="margin: 0;">
  //         <span style="font-size: 22px; font-weight: 800; color: black;">
  //           ${NCompleted}
  //         </span>
  //         <span style="font-size: 13px;">
  //           /${NAll}
  //         </span>
  //       </p>
  //       <p style="margin: 0;">learning completed</p>
  //     </div>
  //   </td>
  // `
  //     : ''
  // }
}

export const mapInvitationUsers = ({ users, totalCount }) => {
  return `
    <tr>
        <td align="center" bgcolor="#ffffff" valign="top" style="font-size: 14px; color: #3B4B66; max-width: 535px;" class="fallback-font">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
            <td>
                <table style="text-align: left;">
                    <tr>
                        <td>
                            To get started, <span style="font-weight: bold;">set up your profile</span> and join your colleagues.
                        </td>
                    </tr>
                </table>
            </td>
            ${users
              .slice(0, 2)
              .map(
                ({ name, imgLink, roleAtWork }) => `
                <td style="vertical-align: baseline;">
                  <table style="width: 90px; font-size: 12px; line-height: 16px; text-align: center;">
                      <tr>
                          <td>
                            <div
                              style="-webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%; overflow:hidden!important; mso-hide: all; width: 66px; height: 66px; background-size: contain; background-image: url('https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'); margin: 0 auto;"
                            >
                            ${
                              imgLink
                                ? `
                              <img
                                src="${imgLink}"
                                width="66"
                                height="66"
                              />
                            `
                                : ''
                            }
                            </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <span style="font-size: 14px !important; line-height: 18px !important; font-weight: bold !important;">
                                ${name}
                              </span>
                          </td>
                      </tr>
                      <tr>
                          <td>${roleAtWork}</td>
                      </tr>
                  </table>
              </td>
            `
              )
              .join('')}
            ${
              totalCount > 0
                ? `
              <td>
                  <table style="color:#5a55ab; font-size: 18px;line-height: 26px; font-weight: bold; text-align: center;">
                      <tr>
                          <td>+${totalCount}</td>
                      </tr>
                  </table>
              </td>
            `
                : ''
            }
          </tr>
            </table>
        </td>
    </tr>
  `
}

export const mapUnscheduledUsers = ({ users }) => {
  let i = 0
  // GROUP USERS INTO TUPLETS OF 3
  const groupedUsers = users.reduce(
    (acc, curr) => {
      if (acc[i].length < 3) {
        acc[i].push(curr)
        return acc
      } else {
        i++
        return [...acc, [curr]]
      }
    },
    [[]]
  )

  const mappedUsers = groupedUsers
    .map(group => {
      return `
      <tr>
        ${group
          .map(
            ({ name, imgLink, roleAtWork }) => `
          <td align="center" style="width: 33%;">
            <div>
              <div>
                <img
                  src="${imgLink || placeholderLink}"
                  alt="profile picture"
                  width="60"
                  height="60"
                  style="border-radius: 50%; margin-bottom: 10px;"
                />
              </div>
              <div>
                <p style="margin: 5px 0; font-size: 14px; font-weight: 500;">${name}</p>
                <p style="margin: 5px 0; font-size: 12px; font-weight: normal;">${roleAtWork}</p>
              </div>
            </div>
          </td>
        `
          )
          .join(' ')}
      </tr>
    `
    })
    .join(' ')

  return `
    <tr>
      <td valign="top" class="mcnTextBlockInner">
        <table width="100%"  border="0" cellspacing="0" cellpadding="0">
          ${mappedUsers}
        </table>
      </td>
    </tr>
  `
}

export const mapUserGoals = ({ goals, lastChild, noMargin }) => {
  return `
    <tr>
      <td valign="top" class="mcnTextBlockInner" style="padding: 10px 0;${
        lastChild ? '' : ' border-bottom: 1px solid; border-color: #e8e8e8;'
      }" align="center">
        <div class="user-goals ${noMargin ? 'user-goals--no-margin' : ''}">
          ${goals
            .map(goal => {
              let content
              if (typeof goal === 'object') {
                const { goalName, note } = goal

                let noteContent = ''
                let goalContent = goalName

                if (note)
                  noteContent = `
                    <p style="padding: 10px; background-color: white; margin-right: 30px; text-align: left;">
                      <b>Note:</b> <i>${note}</i>
                    </p>
                  `

                content = `
                    ${goalContent}<br/>
                    ${noteContent}
                  `
              } else {
                content = goal
              }
              return `
                  <p style="text-align: left;" >
                    <img
                      src="https://innential-production.s3.eu-central-1.amazonaws.com/email/goal.png"
                      alt="goal-icon"
                      width="16"
                      style="width: 16px; height: 16px;"
                    />
                    ${content}
                  </p>
                `
            })
            .join(' ')}
        </div>
      </td>
    </tr>
  `
}

export const mapUserItem = ({
  _id,
  name,
  imgLink,
  roleAtWork,
  activeGoals,
  appLink
}) => {
  return `
    <tr>
      <td valign="top" class="mcnTextBlockInner" style="padding: 21px 30px 0px 32px;">
        <table class="user-item" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width: 15%;">
            <a href="${appLink}/profiles/${_id}">
              <div class="user-image">
                <img width="50" src="${imgLink ||
                  placeholderLink}" alt="profile picture"/>
              </div>
            </a>
            </td>
            <td style="width: 65%;">
            <a href="${appLink}/profiles/${_id}">
              <div class="user-info">
                <p style="font-size: 16px; font-weight: 500;">${name}</p>
                <p style="font-size: 12px; font-weight: normal;">${roleAtWork}</p>
              </div>
            </a>
            </td>
            ${
              activeGoals && activeGoals.length > 0
                ? `
              <td style="width: 20%; text-align: right;">
              <a href="${appLink}/profiles/${_id}">
                <p style="font-size: 12px; font-weight: bold; color: #000000; text-decoration: none;">
                  <img
                    src="https://innential-production.s3.eu-central-1.amazonaws.com/email/goal.png"
                    alt="goal-icon"
                    width="16"
                    style="width: 16px; height: 16px;"
                  />
                  ${activeGoals.length} active ${
                    activeGoals.length > 1 ? 'goals' : 'goal'
                  }
                </p>
              </a>
              </td>
            `
                : ''
            }
          </tr>
        </table>
      </td>
    </tr>
  `
}

export const mapUserRequestItem = ({
  _id,
  name,
  imgLink,
  roleAtWork,
  total,
  nItems,
  lastChild,
  // activeGoals,
  appLink
}) => {
  return `
    <tr>
      <td valign="top" class="mcnTextBlockInner" style="padding: 21px 30px 21px 32px;${
        lastChild ? '' : ' border-bottom: 1px solid; border-color: #e8e8e8;'
      }">
        <table class="user-item" border="0" cellspacing="0" cellpadding="0" >
          <tr>
            <td style="width: 15%;">
            <a href="${appLink}/user-requests/${_id}">
              <div class="user-image">
                <img src="${imgLink ||
                  placeholderLink}" alt="profile picture" width="50"/>
              </div>
            </a>
            </td>
            <td style="width: 65%;">
            <a href="${appLink}/user-requests/${_id}">
              <div class="user-info">
                <p style="font-size: 16px; font-weight: 500;">${name}</p>
                <p style="font-size: 12px; font-weight: normal;">${roleAtWork}</p>
              </div>
            </a>
            </td>
            <td style="width: 15%;">
            <a href="${appLink}/user-requests/${_id}">
              <div class="user-info">
                <p style="font-size: 16px; font-weight: 800; color: #88c539;">€${total.toFixed(
                  2
                )}</p>
                <p style="font-size: 12px; font-weight: normal;">${nItems} resource${
    nItems > 1 ? 's' : ''
  }</p>
              </div>
            </a>
            </td>
            <td style="width: 5%;">
              <a href="${appLink}/user-requests/${_id}">
                <!--
                  <div>
                    <img src="${imgLink ||
                      placeholderLink}" alt="arrow" width="24" height="24"/>
                  </div>
                -->
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

const mapActionItem = ({
  label,
  iconSource,
  alt = 'action-icon',
  style,
  linkStyle,
  href
}) => {
  return `
    <div
      style="${style}"
    >
      <a
        href="${href}"
        style="${linkStyle}"
      >
        <img
          src="${iconSource}"
          alt="${alt}"
          width="9"
          height="9"
          style="width: 9px; height: 9px;"
        />
        ${label}
      </a>
    </div>
  `
}

export const mapDigestItem = ({
  _id,
  title,
  // paid,
  type,
  source, // string
  // level, // enum
  link, // raw link
  skills, // array of strings
  sharedBy, // object { _id, name, imgLink }
  appLink, // string
  showLike, // bool
  lastChild, // bool
  approved, // bool
  request, // bool
  note, // string
  delivery // bool
}) => {
  // const paidString = paid ? '<div class="learning-item__info-paid">Paid</div>' : ''

  let iconSource = courseLink
  switch (type) {
    case 'ARTICLE':
      iconSource = articleLink
      break
    case 'BOOK':
      iconSource = bookLink
      break
    case 'TOOL':
      iconSource = toolLink
      break
    default:
      break
  }

  const itemSkills = skills
    .slice(0, 5)
    .map(
      skill => `
      <td>
        <div style="font-size: 11px; color: #5a55ab; padding: 5px 10px; margin: 5px; border-radius: 3px; background: rgba(231, 230, 255, 0.6);">${skill}</div>
      </td>
    `
    )
    .join(' ')

  return `
    <tr>
      <td valign="top" class=" mcnTextBlockInner" style="padding-top: 24px;">
        <table width="100%" >
          <tr>
          ${
            sharedBy
              ? `
              <td style="width: 5%;">
                <a href="${appLink}/profiles/${
                  sharedBy._id
                }" style="text-decoration: none; color: black;">
                  <div style="font-size: 12px;margin-right: 10px;text-align: center;">
                    <div>
                      <img src="${sharedBy.imgLink ||
                        placeholderLink}" alt="profile picture" width="50" style="border-radius: 50%;"/>
                    </div>
                    <div style="font-weight: bold;">
                    ${sharedBy.name}
                    </div>
                  </div>
                </a>
              </td>
            `
              : ''
          }
            <td style="max-width: 300px;">
              <div class="learning-item__info-text">
                <p style="color: #979797; font-size: 12px; line-height: 16px;"><img src="${iconSource}" style="margin-right: 8px;" alt="icon" width="16px" height="16px"/>${capitalize(
    type
  )}: <span style="font-weight: bold; color: #000000">${source}</span></p>
                <p ><a style="color: black; font-size: 14px;" href="${link}">${title}</a></p>
              </div>
              </td>
            <!-- <td style="width: 50%;"></td> -->
            ${
              !delivery
                ? request
                  ? `
                  <td>
                    <div
                      style="color: ${
                        approved ? '#88c539' : '#dc3250'
                      }; text-align: right; padding-right: 30px; font-weight: 800;"
                    >
                      ${approved ? 'Approved' : 'Rejected'}
                    </div>
                  </td>
                `
                  : `
              <td>
                ${mapActionItem({
                  label: 'Add to development plan',
                  iconSource:
                    'https://innential-production.s3.eu-central-1.amazonaws.com/email/icons8-plus-24.png',
                  alt: 'plus',
                  style: 'text-align: right',
                  linkStyle:
                    'color: #5a55ab; font-size: 11px; font-weight: 500;text-decoration: none;',
                  href: `${appLink}/plan/add/${_id}`
                })}
                ${
                  showLike
                    ? mapActionItem({
                        label: 'Like',
                        iconSource:
                          'https://innential-production.s3.eu-central-1.amazonaws.com/email/ionicons_2-0-1_android-favorite-outline_36_0_dc3250_none.png',
                        alt: 'heart',
                        style: 'text-align: right',
                        linkStyle:
                          'color: #dc3250; font-size: 11px; font-weight: 500;text-decoration: none;',
                        href: `${appLink}/like-content/${_id}`
                      })
                    : ''
                }
              </td>
            `
                : ''
            }
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td valign="top" class="mcnTextBlockInner" style="padding: 10px 0 32px;">
        <table>
          <tr>
            ${itemSkills}
          </tr>
        </table>
      </td>
    </tr>
    ${
      note
        ? `
      <tr>
      <td>
        <p style="text-align: justify; padding: 10px 30px 32px;">
          <b>Note from ${
            sharedBy && sharedBy.name ? sharedBy.name.split(' ')[0] : 'reviewer'
          }:</b>
          <br/>
          <div style="padding: 20px; border: 1px solid #e8e8e8">
            ${note}
          </div>
        </p>
      </td>
      </tr>
    `
        : ''
    }
    <tr style="${
      lastChild ? '' : ' border-bottom: 1px solid; border-color: #e8e8e8;'
    }">
      <td></td>
    </tr>
  `
}

export const mapContentHeader = headerName => {
  return `
  <!-- CONTENT HEADER // -->
          <tr class="bg-grey--mobile">
            <td align="center" valign="top" width="600">
              <table width="600" border="0" cellspacing="0" cellpadding="0" align="center">
                <tbody>
                  <tr>
                    <td align="center" valign="top" class="hidden"></td>
                    <td
                      align="right"
                      width="30"
                      valign="top"
                      class="hidden"
                      bgcolor="#EDF2F5"
                    ></td>
                    <td width="540" class="container" bgcolor="#EDF2F5"></td>
                    <td
                      align="left"
                      width="30"
                      valign="top"
                      class="hidden"
                      bgcolor="#EDF2F5"
                    ></td>
                    <td align="center" valign="top" class="hidden"></td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" class="hidden"></td>
                    <td
                      align="right"
                      width="30"
                      valign="top"
                      class="hidden"
                      bgcolor="#EDF2F5"
                    ></td>
                    <td
                      bgcolor="#EDF2F5"
                      class="container"
                      width="540"
                      align="left"
                    >
                    <p class="articles-title">${headerName}</p>
                    </td>
                    <td
                      align="left"
                      width="30"
                      valign="top"
                      class="hidden"
                      bgcolor="#EDF2F5"
                    ></td>
                    <td align="center" valign="top" class="hidden"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <!-- // END CONTENT HEADER -->
  `
}

export const mapInvitationMessage = ({ invitingPerson, organizationName }) => {
  return `
  <tr>
    <td height="25" align="center" valign="top">&nbsp;</td>
  </tr>
  <tr>
    <td align="center"  valign="top" style="font-size: 14px; color: #3B4B66; max-width: 424px;" class="fallback-font">
    <table>
        <tr>
            ${
              invitingPerson
                ? `
              <td>
                  <table style="width: 90px; font-size: 12px; line-height: 16px; text-align: center;">
                      <tr>
                          <td>
                            <div
                              style="-webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%; overflow:hidden!important; mso-hide: all; width: 66px; height: 66px; background-size: contain; background-image: url('https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'); margin: 0 auto;"
                            >
                            ${
                              invitingPerson.imgLink
                                ? `
                              <img
                                src="${invitingPerson.imgLink}"
                                width="66"
                                height="66"
                              />
                            `
                                : ''
                            }
                            </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <span style="font-size: 14px !important; line-height: 18px !important; font-weight: bold !important;">
                                ${invitingPerson.name}
                              </span>
                          </td>
                      </tr>
                      <tr>
                          <td>${invitingPerson.roleAtWork}</td>
                      </tr>
                  </table>
              </td>
            `
                : ''
            }
            <td>
                <table style="${
                  invitingPerson ? 'margin-left:60px; ' : ''
                }text-align: ${invitingPerson ? 'left' : 'center'};">
                    <tr>
                        <td>
                            Innential is an education platform that helps <span style="font-weight: bold;">${organizationName} employees</span> reach the top of their profession
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </td>
  </tr>
  <tr>
    <td height="30" align="center" valign="top">&nbsp;</td>
  </tr>
  `

  // OLD INVITATION BELOW

  // const invitationItems = corporate
  //   ? [
  //       { label: 'Ask for and give feedback to colleagues', icon: glassLink },
  //       { label: 'Participate in team reviews', icon: chartLink },
  //       { label: 'Set learning goals', icon: thumbLink },
  //       { label: 'And much more!', icon: wrenchLink }
  //     ]
  //   : [
  //       { label: 'Set learning goals', icon: thumbLink },
  //       {
  //         label:
  //           'Find learning resources (articles, videos, e-learning, and more)',
  //         icon: glassLink
  //       },
  //       { label: 'Track learning progress', icon: chartLink },
  //       { label: 'And much more!', icon: wrenchLink }
  //     ]

  // return `
  //   <tr>
  //     <td valign="top" class="mcnTextBlockInner" >
  //       <div class="user-goals" style="margin: 20px 30px; padding: 10px 0 10px 20px;">
  //       <table align="center" width="95%"><tr><td style="background:#F7F7FF">
  //         <h5 style="font-size: 15px; font-family:Arial, Helvetica, sans-serif; font-weight: bold; margin-bottom: 15px; text-align: center;">After you finish onboarding, you'll be able to:</h5>
  //         ${invitationItems
  //           .map(
  //             ({ label, icon }) => `
  //           <p style="display: block; padding-bottom: 10px; padding-left: 10px; font-family:Arial, Helvetica, sans-serif; font-size: 14px;font-weight: normal;font-stretch: normal;font-style: normal;line-height: 1.8;">
  //             <img width="20" height="20" alt="target" style="margin-right: 20px; vertical-align: text-bottom;" src="${icon}"/>${label}
  //           </p>
  //         `
  //           )
  //           .join('')}
  //         </td></tr></table>
  //       </div>
  //       <div class="user-goals__line" style="margin-top: 20px;"></div>
  //     </td>
  //   </tr>
  //   ${mapRowGreyText(
  //     'Have questions? Chat with us anytime using the in-app chat.'
  //   )}
  // `
}

export const mapFeedback = content => {
  return `
    <tr>
      <td valign="top" class="mcnTextContent"
        style="padding-top:0; padding-bottom:9px; ">
        <div style="text-align: center; margin-top: 16px; padding: 18px; text-align: justify; border: 1px solid #979797">
            <span
              style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;"
            >
            ${content}
            </span>
        </div>
      </td>
    </tr>
  `
}

export const mapRowGreyText = content => {
  return `
  <tr>
    <td valign="top" class="mcnTextContent"
    align="center"
      style="padding-top:0; padding-bottom:9px;">

      <div style="text-align: center; margin-top: 16px;>
        <span style="color:#979797">
          <span
            style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;
            background-color: white;
            "
          >
            ${content}
            </span>
          </span>
      </div>
    </td>
  </tr>
  `
}

export const mapButton = ({ text, link }) => {
  return `
    <tr>
      <tr><td><br></td></tr>
      <td>
        <table align="center" valign="middle" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <a href="${link}" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 41px;font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; background-color: #5a55ab; border-top: 6px solid #5a55ab; border-bottom: 6px solid #5a55ab; border-right: 40px solid #5a55ab; border-left: 40px solid #5a55ab; display: inline-block; border-radius: 50px;">${text}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

export const mapRowBlackText = (
  content,
  size = '15px',
  weight = 'bold',
  align = 'center'
) => {
  return `
  <tr>
    <td valign="top" class="mcnTextContent"
      style="padding-top:0; padding-bottom:9px;">
      <div style="text-align: ${align}; margin-top: 16px;">
        <span style="color:#000000";
            dispay:flex;
            width:100%;
            justify-content:center;
            background-color:#fff;

        >
          <span
            style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;
            font-weight:${weight};font-size:${size};">
            ${content}
            </span>
          </span>
      </div>
    </td>
  </tr>
  `
}

/* THIS IS THE EMAIL TEMPLATE PAGE AS A STRING */

export default ({
  metaEmailTitle,
  /* title, */ header = 'Hello there!',
  content,
  compassBranding = false
}) => {
  return `${
    /*
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
  <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${metaEmailTitle}</title>
    <link href="https://fonts.googleapis.com/css?family=arial:400,500,600,700,800,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800" rel="stylesheet">

    <style type="text/css">
      ${templateStyle}
    </style>

     <!--[if mso]>
     <style>
         ${outlookResetStyles}

    </style>
     <!--[endif]>

  </head>

  <body >


    <center style="background:#fafafa;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" bgcolor="#fafafa" >
        <tr>
          <td align="center" valign="top" id="bodyCell">
            <!-- BEGIN TEMPLATE // -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafafa" style="background-color:#fafafa">

              <!-- BEGIN HEADER // -->

              <tr>
                <td align="center" valign="top" id="templateHeader" style="background-color:#fafafa" data-template-container">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                    <tr>
                      <td valign="top" class="headerContainer" align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="mcnImageBlock"
                          style="min-width:100%; align="center">
                          <tbody class="mcnImageBlockOuter">
                            <tr>
                              <td valign="top" class="mcnImageBlockInner">
                              <center>
                                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                                  class="mcnImageContentContainer" style="min-width:100%;">
                                  <tbody>
                                    <tr>
                                      ${
                                        !compassBranding
                                          ? `
                                      <td class="mcnImageContent" valign="top"
                                        style="padding-top: 0; padding-bottom: 0; text-align:center; background: #fafafa;">
                                        <img align="center" alt=""
                                          src="https://mcusercontent.com/2225288f0bd7694bf0e93c3b0/images/f26a47ee-e8e3-488d-a01c-3be931a0f7e7.jpg"
                                          style="max-width:600px; width: 100%; padding-bottom: 0; display: inline !important; vertical-align: bottom; height: auto !important"
                                          width="600"
                                          class="mcnImage">
                                      </td>
                                      `
                                          : `
                                      <td valign="top"
																			style="padding-top: 0; padding-bottom: 0; text-align:center;">
                                        <div style="width: 600px; height: 150px">
                                          <div style="background-color: #29a399; border-radius: 4px; color: #ffffff; font-weight: 600; font-family: arial; mso-font-alt: Arial, Helvetica, sans-serif !important;font-size: 40px; line-height: 1.6; padding: 20px; text-align: left">
                                            Career Compass
                                          </div>
                                        </div>
                                      </td>
                                      `
                                      }
                                    </tr>
                                  </tbody>
                                </table>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- // END HEADER -->

              <!-- BEGIN EMAIL // -->
              <table align="center" border="0" cellpadding="0" cellspacing="0"><tbody>
              <tr>
                <td align="center" valign="top" id="templateBody" data-template-container style="background-color: #fafafa;">
                  <center>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer" style="background-color:#ffff">
                    <tr>
                      <td valign="top" class="bodyContainer">

                        <!-- BEGIN EMAIL TITLE // -->

                        <tr>
                          <td valign="top" align="center" class="mcnTextContent"
                            style="padding: 12px 18px 9px;color: #3F7EC1;font-family: arial, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; mso-font-alt: Arial, Helvetica, sans-serif !important;font-size: 10px;font-style: italic;font-weight: bold;">
                            <h1><span style="color:#5a55ab"><span
                                  style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;"><span
                                    style="font-size:26px">${header}</span></span></span></h1>

                            <!--<div id="gtx-trans" style="position: absolute; left: -54px; top: 83.4062px;">
                              <div class="gtx-trans-icon">&nbsp;</div>
                            </div>-->
                          </td>
                        </tr>

                        <!-- // END EMAIL TITLE -->

                        <!-- BEGIN TITLE DIVIDER -->

                        <tr>
                          <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px;">
                            <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="min-width: 100%;border-top: 2px solid #E7E6FF;">
                              <tbody>
                                <tr>
                                  <td>
                                    <span></span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--
                              <td class="mcnDividerBlockInner" style="padding: 18px;">
                              <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
                            -->
                          </td>
                        </tr>

                        <!-- END TITLE DIVIDER -->

                        <!-- CONTENT -->

                        <tr>
                          <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                          <center>
                            <table align="left" border="0" cellpadding="0" cellspacing="0"
                               width="600" class="mcnTextContentContainer">
                              <tbody>
                                ${content}
                              </tbody>
                            </table>
                            </center>
                          </td>
                        </tr>

                        <!-- END CONTENT -->

                          <!-- FOOTER DIVIDER BEGIN -->

                                    <tr>
                                      <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 32px 0px 32px 0px;">
                                        <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                          style="min-width: 100%;border-top: 1px solid #5a55ab;">
                                          <tbody>
                                            <tr>
                                              <td>
                                                <span></span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--
                                          <td class="mcnDividerBlockInner" style="padding: 18px;">
                                          <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
                                        -->
                                      </td>
                                    </tr>
                          </tbody>
                        </table>

                        <!-- FOOTER DIVIDER END -->

                      </td>
                    </tr>
                  </table>
                  </center>

                </td>
              </tr>
              </tbody>
              </table>

              <!-- // END EMAIL -->

              <!-- BEGIN FOOTER // -->

              <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="background-color:#fafafa" >
              <tbody>

              <tr style="height: 30px;">
                <td align="center" valign="top" id="templateFooter" data-template-container >

                <table cellpadding="0" cellspacing="0" width="600" align="center">
                <tbody>
                <tr>
                <td>

                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer" style="background-color:#ffff;" >
                    <tr>
                      <td valign="top" class="footerContainer" width="600" >

                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextBlock"
                          style="min-width:100%;" align="center">
                          <tbody class="mcnTextBlockOuter">
                            <tr>

                              <td valign="top" class="mcnTextContent"
                                style="padding-top:0; padding-left:18px; padding-bottom:9px; padding-right:18px;">

                                <div style="display: flex">
                                  <span>
                                    <span style="color:#000000">
                                      <span style="font-size:14px; font-weight: 500">
                                        <span style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;">
                                          Follow us:
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                  <span style="font-size:14px">
                                    <span style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;">
                                      <span style="color:#000000">
                                      </span>
                                      <span style="color:#000000">
                                      </span>
                                    </span>
                                  </span>
                                  <a href="https://www.linkedin.com/company/innential" target="_blank">
                                    <img
                                      alt="LinkedIn"
                                      height="24"
                                      src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-linkedin-48.png"
                                      style="display:block; padding-left: 20px;"
                                      width="24"
                                    />
                                  </a>
                                </div>
                              </td>

                              <td valign="top" class="mcnTextContent"
                                style="padding-top:0; padding-left:18px; padding-bottom:9px; padding-right:18px;">

                                <div style="text-align: right;"><span
                                    style="font-family:arial,helvetica neue,helvetica,arial,sans-serif;mso-font-alt: Arial, Helvetica, sans-serif !important;"><span
                                      style="font-size:14px"><a href="mailto:${
                                        !compassBranding
                                          ? 'contact@innential.com'
                                          : 'careercompass@innential.com'
                                      }"
                                        target="_blank"><span
                                          style="color:#5a55ab">${
                                            !compassBranding
                                              ? 'contact@innential.com'
                                              : 'careercompass@innential.com'
                                          }</span></a></span></span>
                                </div>

                                <div id="gtx-trans" style="position: absolute; left: -52px; top: 40px;">
                                  <div class="gtx-trans-icon">&nbsp;</div>
                                </div>
                              </td>

                            </tr>
                          </tbody>
                        </table>


                  </table>


                </td>
                </tr>
                </tbody>
                </table>


                </td>
              </tr>

              </tbody>
               </table >

              <!-- // END FOOTER -->

            </table>
            </table>

            <!-- // END TEMPLATE -->
    </center>

  </body>

                                        </html> */ ''
  }

${/* NEW TEMPLATE FOR POSTFINANCE */ ''}

<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!-- NAME: SELL PRODUCTS -->

<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${metaEmailTitle}</title>
<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,600,700,800,900&display=swap" rel="stylesheet">
  <style type="text/css">

    body {
      font-family: 'Roboto', Arial, Helvetica, sans-serif !important;
      line-height: 150%;
    }
    a, a:hover, a:active, a:visited {
      color: #5a55ab;
      text-decoration: none;
    }
    .img-container {
      font-size: 0;
      line-height: 0;
    }
    .img-container img {
      width: 100%;
      height: auto;
    }
    .button-container {
      background: #5a55ab;
      font-family: 'Roboto', Arial, Helvetica, sans-serif !important;
      font-size: 13px;
      color: #ffffff;
      text-decoration: none;
      margin: 0 auto;
      border-radius: 100px;
    }
    .button-container a {
      background: #5a55ab;
      font-family: 'Roboto', Arial, Helvetica, sans-serif !important;
      font-size: 13px;
      color: #ffffff;
      text-decoration: none;
      border: 5px solid #5a55ab;
      display: inline-block;
      width: 100px;
      font-weight: bold;
      border-radius: 100px;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-right: 5px;
      padding-left: 5px;
    }
    .button-container a:visited, .button-container a:active, .button-container a:hover {
      color: #ffffff !important;
    }
    @media only screen and (max-width: 640px) {

      .mobile-container {
        width: 100% !important;
        max-width: 600px !important;
      }

      .mobile--margin {
        width: 20px !important;
      }

      .button-size {
        width: 90% !important;
      }

      .button-container a {
        display: block;
        width: auto !important;
      }

      .hidden, .mobile-hidden {
        display: none !important;
      }

    }
    a[x-apple-data-detectors] {
      color: inherit !important;
    }
  </style>
  <!--[if mso]>
  <style type=”text/css”>
    .fallback-font {
      font-family: Arial, sans-serif;
    }
  </style>
  <![endif]-->
</head>

<body style="margin: 0; padding: 0; text-align: center;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td  align="center" valign="top" bgcolor="#fafafa">
          <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" class="mobile-container">
            <tbody>
              <tr>
              ${
                !compassBranding
                  ? `<td align="left" valign="top" bgcolor="#ffffff" class=" img-container"><a href="https://innential.com/"><img src="https://innential-production.s3.eu-central-1.amazonaws.com/email/600x187_header.png" width="600" height="187" alt="Innential"/></a></td>`
                  : `<td valign="top" style="padding-top: 0; padding-bottom: 0; text-align:center;">
                      <div style="width: 600px; height: 150px">
                        <div style="background-color: #29a399; border-radius: 4px; color: #ffffff; font-weight: 600; font-family: arial; mso-font-alt: Arial, Helvetica, sans-serif !important;font-size: 40px; line-height: 1.6; padding: 20px; text-align: left">
                          Career Compass
                        </div>
                      </div>
                    </td>`
              }
              </tr>
              <tr>
                <td bgcolor="#ffffff">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td width="80" height="30" align="left" valign="top" class="mobile--margin">&nbsp;</td>
                        <td align="left" valign="top">&nbsp;</td>
                        <td width="80" align="left" valign="top" class="mobile--margin">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="left" valign="top" style="border-bottom:1px solid #5a55ab;">&nbsp;</td>
                        <td align="left" valign="top" style="border-bottom:1px solid #5a55ab;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td align="center" valign="top" style="font-size: 26px; color: #5a55ab; font-weight: bold;" class="fallback-font">
                                  ${header}
                                </td>
                              </tr>
                              <tr>
                                <td align="center" valign="top">
                                  <table width="220" border="0" cellspacing="0" cellpadding="0">
                                      <tbody>
                                        <tr>
                                          <td height="25" style="border-bottom: 2px solid #e7e6ff;">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                              </tr>
                              <tr>
                                <td height="25" align="center" valign="top">&nbsp;</td>
                              </tr>
                              ${content}
                              ${
                                /* <tr>
                                //   <td align="center" valign="top" style="font-size: 15px; color: #979797;" class="fallback-font">We miss you!<br>
                                //         It seems you have already registered on our platform<br class="hidden">
                                //         but you didn't finish your onboarding. <br/>
                                //         <br/>
                                //         <span style="color: black; font-weight: bold;">Take a few minutes to finish the onboarding process.
                                //         This is necessary to prepare a personalised learning plan for you.</span></td>
                                // </tr>
                                */ ''
                              }
                              <tr>
                                <td height="30" align="center" valign="top">&nbsp;</td>
                              </tr>

                              <tr>
                                <td height="50" align="center" valign="top">&nbsp;</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td align="left" valign="top" style="border-bottom:1px solid #5a55ab;">&nbsp; </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td align="left" valign="top" bgcolor="#ffffff">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="left" valign="top" bgcolor="#ffffff">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="50" align="left" valign="middle" class="mobile--margin">&nbsp;</td>
                                <td width="70" align="left" valign="middle" style="font-size: 14px; color: black;" class="fallback-font">Follow us:</td>
                                <td width="20" align="left" valign="middle">&nbsp;</td>
                                <td width="24" align="left" valign="middle"><a href="https://www.linkedin.com/company/innential"><img alt="LinkedIn" height="24" src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-linkedin-48.png" width="24"></a></td>
                                <td width="20" align="left" valign="middle">&nbsp;</td>
                                <td align="right" valign="middle"><a href="mailto:contact@innential.com"  class="fallback-font" style="color: #5a55ab !important;  font-size: 14px !important;">contact@innential.com</a></td>
                                <td width="50" align="left" valign="middle" class="mobile--margin">&nbsp;</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" valign="top" bgcolor="#ffffff">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="center" style="font-size: 14px;color: rgba(0, 0, 0, 0.7);background: white;">Write back "unsubscribe" to unsubscribe from these emails.</td>
                      </tr>
                      <tr>
                        <td align="left" valign="top" bgcolor="#ffffff">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#fafafa">&nbsp;</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`
}

/* BELOW: OLD TABLES */
/*
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock"
    style="min-width:100%;">
    <tbody class="mcnButtonBlockOuter">
      <tr>
        <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;"
          valign="top" align="center" class="mcnButtonBlockInner">
          <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer"
            style="border-collapse: separate !important;border-radius: 50px;background-color: #5A55AB;">
            <tbody>
              <tr>
                <td align="center" valign="middle" class="mcnButtonContent"
                  style="font-family: arial, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 13px">
                  <a class="mcnButton " title="Go to Innential" href="https://innential.com/"
                    target="_blank"
                    style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Go
                    to Innential</a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
    style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
      <tr>
        <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
          <table align="left" border="0" cellpadding="0" cellspacing="0"
            style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
            <tbody>
              <tr>

                <td valign="top" class="mcnTextContent"
                  style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                  <div style="text-align: center;"><span style="font-size:15px"><span
                        style="color:#979797"><span
                    style="font-family:arial,helvetica neue,helvetica,arial,sans-serif">If
                    you are still in the reviewing process, please disregard this
                    message.</span></span></span></div>

              </td>
            </tr>
      </tbody>
  </table>
*/
