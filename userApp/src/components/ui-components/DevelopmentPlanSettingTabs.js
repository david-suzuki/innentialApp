import React, { useState, useEffect } from 'react'
// import { Tabs, TabsList, Tab, TabContent } from './Tabs'
import {
  Statement,
  DevelopmentPlanContentList,
  DevelopmentPlanMentorList
  // ActionItem
} from '.'
import separatedContentListStyle from '../../styles/separatedContentListStyle'
import developmentPlanSettingsTabsStyle from '../../styles/developmentPlanSettingsTabsStyle'
import { ReactComponent as OrderIcon } from '../../static/order-icon.svg'

export default ({
  content,
  selectedContent = [],
  mentors,
  selectedMentors = [],
  onSelect,
  onEdit,
  recommended = [],
  // inManagement,
  searchedContentIds = [],
  neededSkills = [],
  // selectedGoalId,
  setContentUploadVisible,
  limit,
  setLimit,
  fetchMore,
  relatedContentLength = [],
  savedForLater = [],
  goToRecommended,
  filters,
  isOnGoalSetting,
  setOrder,
  setContentOrder,
  handleChangingNote,
  totalRelatedContent
  // showSearchedContent
  // setContentStatusMutation,
}) => {
  const isSearching = searchedContentIds.length > 0

  // FILTER CONTENT BY GOAL SELECTED
  // const selectedContent = selectedContent.filter(({ goalId }) => {
  //   if (selectedGoalId !== null) {
  //     if (selectedGoalId === '') {
  //       return !goalId
  //     } else return goalId === selectedGoalId
  //   } else return true
  // })
  // const selectedMentors = selectedMentors.filter(({ goalId }) => {
  //   if (selectedGoalId !== null) {
  //     if (selectedGoalId === '') {
  //       return !goalId
  //     } else return goalId === selectedGoalId
  //   } else return true
  // })

  const [initialSelectedLength, setInitialSelectedLength] = useState(
    selectedContent.length + selectedMentors
  )
  const [highlightSelected, setHighlightSelected] = useState(false)
  const [highlightRecommended, setHighlightRecommended] = useState(false)

  // TRIM SELECTED ITEMS FROM CONTENT AND MENTOR SUGGESTIONS
  const filteredRecommendations = recommended.filter(
    item => !selectedContent.some(({ _id }) => _id === item._id)
  )

  const filteredContent = content.filter(
    item => !selectedContent.some(({ _id }) => _id === item._id)
  )

  // const filteredMentors = mentors.filter(
  //   mentor => !selectedMentors.some(({ _id }) => _id === mentor._id)
  // )

  const filteredSaved = savedForLater.filter(
    item => !selectedContent.some(({ _id }) => _id === item._id)
  )

  //change order options  display
  const [showChangeOrderOptions, setShowChangeOrderOptions] = useState(false)

  // SELECTED TAB HIGHLIGHT EFFECT
  useEffect(() => {
    if (
      selectedContent.length + selectedMentors.length >
      initialSelectedLength
    ) {
      setHighlightSelected(true)
      setTimeout(() => setHighlightSelected(false), 500)
    }
    setInitialSelectedLength(selectedContent.length + selectedMentors.length)
  }, [selectedContent, selectedMentors])

  // RECOMMENDED TAB HIGHLIGHT EFFECT

  useEffect(() => {
    if (content.length > 0 && isSearching) {
      setHighlightRecommended(true)
      setTimeout(() => setHighlightRecommended(false), 500)
    }
  }, [content])

  // ARRANGE LEARNING CONTENT BY TYPE

  // const {
  //   // WORKSHOP: workshops,
  //   ARTICLE: articles,
  //   EVENT: events,
  //   'E-LEARNING': courses,
  //   BOOK: books
  // } = filteredContent.reduce((acc, curr) => {
  //   if (acc[curr.type]) {
  //     return {
  //       ...acc,
  //       [curr.type]: [...acc[curr.type], curr]
  //     }
  //   } else {
  //     return {
  //       ...acc,
  //       [curr.type]: [curr]
  //     }
  //   }
  // }, {})

  // let articleLength = 0
  // let bookLength = 0
  // let courseLength = 0
  // let eventLength = 0

  // if (!isSearching && relatedContentLength && relatedContentLength.length > 0) {
  //   courseLength = relatedContentLength[0]
  //   bookLength = relatedContentLength[1]
  //   eventLength = relatedContentLength[2]
  //   articleLength = relatedContentLength[3]
  // } else {
  //   articleLength = articles && articles.length
  //   bookLength = books && books.length
  //   courseLength = courses && courses.length
  //   eventLength = events && events.length
  // }

  // const other = filteredContent.reduce((acc, curr) => {
  //   if (
  //     !['E-LEARNING', 'BOOK', 'EVENT', 'ARTICLE'].some(
  //       type => curr.type === type
  //     )
  //   ) {
  //     return [...acc, curr]
  //   }
  //   return acc
  // }, [])

  //

  // const highlightWorkshops =
  //   workshops &&
  //   workshops.some(v => !!searchedContentIds.find(s => s === v._id))

  // WHEN SEARCHING CONTENT, FIND OUT WHETHER TO HIGHLIGHT TABS

  // const highlightEvents =
  //   events && events.some(v => !!searchedContentIds.find(s => s === v._id))
  // const highlightCourses =
  //   courses && courses.some(v => !!searchedContentIds.find(s => s === v._id))
  // const highlightBooks =
  //   books && books.some(v => !!searchedContentIds.find(s => s === v._id))
  // const highlightArticles =
  //   articles && articles.some(v => !!searchedContentIds.find(s => s === v._id))

  // ARRANGE SELECTED CONTENT BY TYPE

  const completedContent = selectedContent.filter(
    ({ status }) => status === 'COMPLETED'
  )
  const activeContent = selectedContent.filter(
    ({ status }) => status !== 'COMPLETED'
  )
  const {
    // WORKSHOP: workshops,
    ARTICLE: selectedArticles,
    EVENT: selectedEvents,
    'E-LEARNING': selectedCourses,
    BOOK: selectedBooks
  } = activeContent.reduce((acc, curr) => {
    if (acc[curr.type]) {
      return {
        ...acc,
        [curr.type]: [...acc[curr.type], curr]
      }
    } else {
      return {
        ...acc,
        [curr.type]: [curr]
      }
    }
  }, {})

  const otherSelected = activeContent.reduce((acc, curr) => {
    if (
      !['E-LEARNING', 'BOOK', 'EVENT', 'ARTICLE'].some(
        type => curr.type === type
      )
    ) {
      return [...acc, curr]
    }
    return acc
  }, [])

  const {
    // WORKSHOP: workshops,
    ARTICLE: recommendedArticles,
    EVENT: recommendedEvents,
    'E-LEARNING': recommendedCourses,
    BOOK: recommendedBooks
  } = filteredRecommendations.reduce((acc, curr) => {
    if (acc[curr.type]) {
      return {
        ...acc,
        [curr.type]: [...acc[curr.type], curr]
      }
    } else {
      return {
        ...acc,
        [curr.type]: [curr]
      }
    }
  }, {})

  const otherRecommended = filteredRecommendations.reduce((acc, curr) => {
    if (
      !['E-LEARNING', 'BOOK', 'EVENT', 'ARTICLE'].some(
        type => curr.type === type
      )
    ) {
      return [...acc, curr]
    }
    return acc
  }, [])

  const activeIndex =
    goToRecommended && filteredRecommendations.length > 0
      ? 1
      : selectedContent && selectedContent.length > 0
      ? 0
      : filteredRecommendations.length > 0
      ? 1
      : 2

  const confirmOrder = () => {
    setShowChangeOrderOptions(false)
  }

  return (
    <>
      <div
        className='development-plan__tabs'
        // initialActiveTabIndex={activeIndex}
      >
        <div className='development-plan__tabs-labels'>
          {/* {filteredRecommendations.length > 0 && (
            <Tab>
              <div className='development-plan__tab-label'>
                Recommended by others
                {filteredRecommendations.length > 0 && (
                  <div className='development-plan__tab-item-length'>
                    {filteredRecommendations.length}
                  </div>
                )}
              </div>
            </Tab>
          )} */}
          <div className='tabs-label'>
            {!(selectedContent.length > 0 && showChangeOrderOptions) && (
              <div
                className={`tabs-label__title ${
                  highlightRecommended ? 'highlight-label' : ''
                }`}
              >
                Suggestions based on skills
                {filteredContent.length > 0 && (
                  <div className='development-plan__tab-item-length'>
                    {totalRelatedContent}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='tabs-label'>
            <div
              className={`tabs-label__title ${
                highlightSelected ? 'highlight-label' : ''
              }`}
            >
              Goal Content
              <div className='development-plan__tab-item-length'>
                {selectedContent.length + selectedMentors.length}
              </div>
            </div>
            <div className='tabs-label__order'>
              {selectedContent.length > 1 && !showChangeOrderOptions && (
                <div onClick={() => setShowChangeOrderOptions(true)}>
                  <OrderIcon className='order__icon' />
                  Change order
                </div>
              )}
              {selectedContent.length > 0 && showChangeOrderOptions && (
                <>
                  {/* <div
                    style={{ paddingRight: '16px', color: '#1CB55C' }}
                    onClick={confirmOrder}
                  >
                    <OrderIcon className='order__icon order__icon--green' />
                    Confirm
                  </div> */}
                  {selectedContent.length > 1 && (
                    <div onClick={() => setShowChangeOrderOptions(false)}>
                      Reset
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* {filteredSaved.length > 0 && (
            <Tab>
              <div className='development-plan__tab-label'>
                Saved for later
                <div className='development-plan__tab-item-length'>
                  {filteredSaved.length}
                </div>
              </div>
            </Tab>
          )} */}
          {/* <Tab>
            <div
              className={`development-plan__tab-label ${
                highlightBooks ? 'highlight-label' : ''
              }`}
            >
              Books
              {bookLength > 0 && (
                <div className='development-plan__tab-item-length'>
                  {bookLength}
                </div>
              )}
            </div>
          </Tab>
          <Tab>
            <div
              className={`development-plan__tab-label ${
                highlightEvents ? 'highlight-label' : ''
              }`}
            >
              Events
              {eventLength > 0 && (
                <div className='development-plan__tab-item-length'>
                  {eventLength}
                </div>
              )}
            </div>
          </Tab>
          <Tab>
            <div
              className={`development-plan__tab-label ${
                highlightArticles ? 'highlight-label' : ''
              }`}
            >
              Articles
              {articleLength > 0 && (
                <div className='development-plan__tab-item-length'>
                  {articleLength}
                </div>
              )}
            </div>
          </Tab>
          <Tab>
            <div className='development-plan__tab-label'>
              Other
              {other && other.length > 0 && (
                <div className='development-plan__tab-item-length'>
                  {other.length}
                </div>
              )}
            </div>
          </Tab> */}
          {/* {filteredMentors && filteredMentors.length > 0 && (
            <Tab>
              <div className='development-plan__tab-label'>
                Mentors
                {filteredMentors && filteredMentors.length > 0 && (
                  <div className='development-plan__tab-item-length'>
                    {filteredMentors.length}
                  </div>
                )}
              </div>
            </Tab>
          )} */}

          {/*
          <Tab>
            <div
              className={`development-plan__tab-label ${
                highlightWorkshops ? 'highlight-label' : ''
              }`}
            >
              Internal workshops
              {workshops && workshops.length > 0 && (
                <div className="development-plan__tab-item-length">
                  {workshops.length}
                </div>
              )}
            </div>
          </Tab>
          */}
        </div>

        <div className='development-plan__tabs-content'>
          {!showChangeOrderOptions ? (
            <div className='development-plan__tabs-content__filtered'>
              {filteredContent && filteredContent.length > 0 ? (
                <DevelopmentPlanContentList
                  content={filteredContent.map(item => ({
                    ...item,
                    selected: false
                  }))}
                  limit={limit}
                  // contentKey='courses'
                  setLimit={setLimit}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  inManagement={false}
                  neededSkills={neededSkills}
                  fetchMore={fetchMore}
                  isSearching={isSearching}
                  filters={filters}
                  showChangeOrderOptions={false}
                  draggable={false}
                  totalRelatedContent={totalRelatedContent}
                />
              ) : (
                <Statement
                  content='No learning items matching criteria. If you want to add a learning item, click the button below'
                  button='Add own learning item'
                  onButtonClicked={() => setContentUploadVisible(true)}
                />
              )}
            </div>
          ) : (
            <div className='development-plan__tabs-content__filtered'></div>
          )}
          {/* SELECTION */}
          <div
            className={
              selectedContent.length > 0
                ? 'development-plan__tabs-content__goal-content'
                : 'development-plan__tabs-content__goal-content--empty'
            }
          >
            {selectedContent.length === 0 && (
              <div className='add-content'>
                <div className='add-content__icon-container'>
                  <i className='el-icon-plus'></i>
                </div>
                <div className='add-content__text'>
                  <span className='add-content__text--bolder'>
                    Click Add button
                  </span>
                  <span>to build goal structure</span>
                </div>
              </div>
            )}

            {!isOnGoalSetting ? (
              <div className='separated-list'>
                {selectedBooks && selectedBooks.length > 0 && (
                  <div>
                    <p className='separated-list__title'>Books</p>
                    <DevelopmentPlanContentList
                      content={selectedBooks.map(item => ({
                        ...item,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                      handleChangingNote={handleChangingNote}
                    />
                  </div>
                )}

                {selectedCourses && selectedCourses.length > 0 && (
                  <div>
                    <p className='separated-list__title'>E-Learning</p>
                    <DevelopmentPlanContentList
                      content={selectedCourses.map(item => ({
                        ...item,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                      handleChangingNote={handleChangingNote}
                    />
                  </div>
                )}
                {selectedArticles && selectedArticles.length > 0 && (
                  <div>
                    <p className='separated-list__title'>Articles</p>
                    <DevelopmentPlanContentList
                      content={selectedArticles.map(item => ({
                        ...item,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                      handleChangingNote={handleChangingNote}
                    />
                  </div>
                )}

                {selectedEvents && selectedEvents.length > 0 && (
                  <div>
                    <p className='separated-list__title'>Events</p>
                    <DevelopmentPlanContentList
                      content={selectedEvents.map(item => ({
                        ...item,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                      handleChangingNote={handleChangingNote}
                    />
                  </div>
                )}
                {otherSelected && otherSelected.length > 0 && (
                  <div>
                    <p className='separated-list__title'>Other</p>
                    <DevelopmentPlanContentList
                      content={otherSelected.map(item => ({
                        ...item,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                      handleChangingNote={handleChangingNote}
                    />
                  </div>
                )}

                {/* {selectedMentors && selectedMentors.length > 0 && (
                <div>
                  <p className='separated-list__title'>Mentors</p>
                  <DevelopmentPlanMentorList
                    mentors={selectedMentors.map(item => ({
                      ...item,
                      selected: true
                    }))}
                    onSelect={onSelect}
                    inManagement={false}
                    neededSkills={neededSkills}
                  // selectedMentors={selectedMentors}
                  />
                </div>
              )} */}

                {completedContent && completedContent.length > 0 && (
                  <div>
                    <p className='separated-list__title'>Completed</p>
                    <DevelopmentPlanContentList
                      content={completedContent.map(c => ({
                        ...c,
                        selected: true
                      }))}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      inManagement={false}
                      neededSkills={neededSkills}
                    />
                  </div>
                )}

                {recommended.length > 0 && (
                  <div className='development-plan__tabs-content__list'>
                    {/* RECOMMENDATIONS */}
                    <div className='separated-list'>
                      {recommendedBooks && recommendedBooks.length > 0 && (
                        <div>
                          <p className='separated-list__title'>Books</p>
                          <DevelopmentPlanContentList
                            content={recommendedBooks.map(item => ({
                              ...item,
                              selected: false
                            }))}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            inManagement={false}
                            neededSkills={neededSkills}
                          />
                        </div>
                      )}

                      {recommendedCourses && recommendedCourses.length > 0 && (
                        <div>
                          <p className='separated-list__title'>E-Learning</p>
                          <DevelopmentPlanContentList
                            content={recommendedCourses.map(item => ({
                              ...item,
                              selected: false
                            }))}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            inManagement={false}
                            neededSkills={neededSkills}
                          />
                        </div>
                      )}

                      {recommendedArticles && recommendedArticles.length > 0 && (
                        <div>
                          <p className='separated-list__title'>Articles</p>
                          <DevelopmentPlanContentList
                            content={recommendedArticles.map(item => ({
                              ...item,
                              selected: false
                            }))}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            inManagement={false}
                            neededSkills={neededSkills}
                          />
                        </div>
                      )}

                      {recommendedEvents && recommendedEvents.length > 0 && (
                        <div>
                          <p className='separated-list__title'>Events</p>
                          <DevelopmentPlanContentList
                            content={recommendedEvents.map(item => ({
                              ...item,
                              selected: false
                            }))}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            inManagement={false}
                            neededSkills={neededSkills}
                          />
                        </div>
                      )}
                      {otherRecommended && otherRecommended.length > 0 && (
                        <div>
                          <p className='separated-list__title'>Other</p>
                          <DevelopmentPlanContentList
                            content={otherRecommended.map(item => ({
                              ...item,
                              selected: false
                            }))}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            inManagement={false}
                            neededSkills={neededSkills}
                          />
                        </div>
                      )}
                    </div>
                    {/* <DevelopmentPlanContentList
                    content={recommended.map(item => ({
                      ...item,
                      selected: false
                    }))}
                    onSelect={onSelect}
                    inManagement={false}
                    neededSkills={neededSkills}
                  /> */}
                  </div>
                )}
              </div>
            ) : showChangeOrderOptions ? (
              <DevelopmentPlanContentList
                key={1}
                content={selectedContent.map(item => ({
                  ...item,
                  selected: true
                }))}
                onSelect={onSelect}
                onEdit={onEdit}
                inManagement={false}
                neededSkills={neededSkills}
                isOnGoalSetting
                setOrder={setOrder}
                setContentOrder={setContentOrder}
                draggable={true}
                showChangeOrderOptions={showChangeOrderOptions}
                confirmOrder={confirmOrder}
              />
            ) : (
              <DevelopmentPlanContentList
                key={2}
                content={selectedContent.map(item => ({
                  ...item,
                  selected: true
                }))}
                onSelect={onSelect}
                onEdit={onEdit}
                inManagement={false}
                neededSkills={neededSkills}
                isOnGoalSetting
                setOrder={setOrder}
                setContentOrder={setContentOrder}
                draggable={false}
                showChangeOrderOptions={showChangeOrderOptions}
                handleChangingNote={handleChangingNote}
              />
            )}
          </div>
          {/* COURSES */}

          {/* {filteredSaved.length > 0 && (
                    <TabContent> */}
          {/* SAVED FOR LATER */}
          {/* <DevelopmentPlanContentList
                        content={filteredSaved.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        inManagement={false}
                        neededSkills={neededSkills}
                      /> */}
          {/* <DevelopmentPlanContentList
                      content={recommended.map(item => ({
                        ...item,
                        selected: false
                      }))}
                      onSelect={onSelect}
                      inManagement={false}
                      neededSkills={neededSkills}
                    /> */}
          {/* </TabContent> */}
          {/* )} */}
          {/* BOOKS */}
          {/* <TabContent>
                    {books && books.length > 0 ? (
                      <DevelopmentPlanContentList
                        content={books.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        limits={limits}
                        contentKey='books'
                        setLimits={setLimits}
                        onSelect={onSelect}
                        inManagement={false}
                        neededSkills={neededSkills}
                        fetchMore={fetchMore}
                        isSearching={isSearching}
                      />
                    ) : (
                      <Statement
                        content='No books matching criteria. If you want to add a book, click the button below'
                        button='Add own learning item'
                        onButtonClicked={() => setContentUploadVisible(true, 'BOOK')}
                      />
                    )}
                  </TabContent> */}
          {/* EVENTS */}
          {/* <TabContent>
                    {events && events.length > 0 ? (
                      <DevelopmentPlanContentList
                        content={events.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        limits={limits}
                        contentKey='events'
                        setLimits={setLimits}
                        onSelect={onSelect}
                        inManagement={false}
                        neededSkills={neededSkills}
                        fetchMore={fetchMore}
                        isSearching={isSearching}
                      />
                    ) : (
                      <Statement
                        content='No events matching criteria. If you want to add an event, click the button below'
                        button='Add own learning item'
                        onButtonClicked={() => setContentUploadVisible(true, 'EVENT')}
                      />
                    )}
                  </TabContent> */}
          {/* ARTICLES */}
          {/* <TabContent>
                    {articles && articles.length > 0 ? (
                      <DevelopmentPlanContentList
                        content={articles.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        limits={limits}
                        contentKey='articles'
                        setLimits={setLimits}
                        onSelect={onSelect}
                        inManagement={false}
                        neededSkills={neededSkills}
                        fetchMore={fetchMore}
                        isSearching={isSearching}
                      />
                    ) : (
                      <Statement
                        content='No articles matching criteria. If you want to add an article, click the button below'
                        button='Add own learning item'
                        onButtonClicked={() => setContentUploadVisible(true, 'ARTICLE')}
                      />
                    )}
                  </TabContent> */}
          {/* OTHER */}
          {/* <TabContent>
                    {other && other.length > 0 ? (
                      <DevelopmentPlanContentList
                        content={other.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        onSelect={onSelect}
                        inManagement={false}
                        neededSkills={neededSkills}
                      />
                    ) : (
                      <Statement
                        content='No learning matching criteria. If you want to add a learning item, click the button below'
                        button='Add own learning item'
                        onButtonClicked={() => setContentUploadVisible(true)}
                      />
                    )}
                  </TabContent> */}
          {/* MENTORS */}
          {/* {filteredMentors && filteredMentors.length > 0 && (
                    <TabContent>
                      <DevelopmentPlanMentorList
                        mentors={filteredMentors.map(item => ({
                          ...item,
                          selected: false
                        }))}
                        onSelect={onSelect}
                        inManagement={false}
                      // selectedMentors={selectedMentors}
                      />
                    </TabContent>
                  )} */}
          {/* WORKSHOPS */
          /*
                  <TabContent>
                  {workshops && workshops.length > 0 ? (
                    workshops.map(content => {
                      return (
                        <DevelopmentPlanWorkshop
                          key={content._id}
                          {...content}
                          onSelect={() => {
                            if (!inManagement) onSelect(content, 'selectedContent')
                          }}
                          inManagement={inManagement}
                        />
                      )
                    })
                  ) : (
                    <Statement
                      content={
                        inManagement
                          ? 'Nothing to show'
                          : `No items matching criteria. You can add workshops and other items from the Upload menu.`
                      }
                    />
                  )}
                  </TabContent> 
                  */}
        </div>
        {/* {filteredContent.length +
                  filteredMentors.length +
                  filteredRecommendations.length ===
                  0 && (
                  <ActionItem
                    label="Can't find the content you need?"
                    content="Feel free to message us and we'll pick something just for you."
                    button="Contact us"
                    onButtonClicked={() =>
                      window.Intercom(
                        'showNewMessage',
                        `Hi, could you help me find content for my development plan?`
                      )
                    }
                    purpleBackground
                  />
                )} */}
      </div>
      <style jsx>{separatedContentListStyle}</style>
      <style jsx>{developmentPlanSettingsTabsStyle}</style>
    </>
  )
}
