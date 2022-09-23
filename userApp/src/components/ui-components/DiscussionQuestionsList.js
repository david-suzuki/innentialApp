import React from 'react'
import DiscussionQuestion from './DiscussionQuestion'
import discussionQuestionsListStyle from '../../styles/discussionQuestionsListStyle'
import { Statement } from '.'

// const DUMMY_DATA = [
//   {
//     id: 'c1',
//     author: 'John Doe',
//     title: 'Async Style for Non-Remote?',
//     resolved: true,
//     content:
//       'Teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//     date: '2021-11-3',
//     likes: 21,
//     comments: [
//       {
//         id: 'a1',
//         author: 'Maria Doe',
//         content:
//           'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//         date: '2021-11-3',
//         likes: 30,
//         bestAnswer: false,
//         reply:
//           {
//             id: 'c1',
//             author: 'John Doe',
//             content:
//               'They can benefit from async communication. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//             date: '2021-11-3',
//             likes: 30,
//           }
//       },
//       {
//         id: 'a2',
//         author: 'Johnathan Debrie',
//         content:
//           'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//         date: '2021-11-3',
//         likes: 30,
//         bestAnswer: false
//       }
//     ]
//   },
//   {
//     id: 'c2',
//     author: 'Maria Doe',
//     title: 'Async future?',
//     resolved: false,
//     content:
//       'Co-located teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//     date: '2021-11-1',
//     likes: 30,
//     comments: [
//       {
//         id: 'a3',
//         author: 'Mary Mae',
//         content:
//           'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//         date: '2021-11-3',
//         likes: 30,
//         bestAnswer: true
//       },
//       {
//         id: 'a4',
//         author: 'Johnathan Debrie',
//         content:
//           'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//         date: '2021-11-3',
//         likes: 30,
//         bestAnswer: false
//       }
//     ]
//   }
// ]

const DiscussionQuestionsList = ({ questions = [], showEmpty }) => {
  // const sortedComments = questions.sort(
  // 	(a, b) => parseFloat(b.likes) - parseFloat(a.likes)
  // );
  // const bestAnswer = sortedComments[0];
  // const ohterComments = sortedComments.slice(1, sortedComments.length);

  return (
    <div className='questions__list'>
      <ul>
        {/* <li>
          <Article
            key={articleListStyle.id}
            badgeClassName={'header__badge'}
            article={article}
          />
        </li> */}
        {questions.map((question, i) => (
          <li key={question._id}>
            <DiscussionQuestion
              question={question}
              badgeClassName={'header__badge--empty'}
              isFirstQuestion={i === 0}
            />
          </li>
        ))}
        {questions.length === 0 && showEmpty && (
          <Statement content='No questions yet. Be the first?' />
        )}
      </ul>
      <style jsx>{discussionQuestionsListStyle}</style>
    </div>
  )
}

export default DiscussionQuestionsList

// DiscussionQuestionsList.defaultProps = {
//   questions: DUMMY_DATA,
//   currentUser: {name: 'Maria Doe'}
// }
