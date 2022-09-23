import React from 'react'
import { graphql } from 'react-apollo'
import { Route, Switch, Redirect } from 'react-router-dom'

import { storeQuery } from './api'
import { SkillsList, SkillsEdit } from './components/skills'
import {
  LearningContentList,
  LearningContentEdit,
  LearningContentOrganization,
  LearningContentRatings
} from './components/learning-content'
import { DigestRequest } from './components/digest'
import { Authenticate, SidebarNav } from './components/general'
import {
  // TeamContentPage,
  OrganizationList,
  OrganizationPage,
  OrganizationEdit,
  OrganizationTeamView,
  SetCustomSkillCategory
} from './components/organization'
import { SourcesList, SourceEdit } from './components/content-sources'
import { EditSkillsFramework } from './components/frameworks'
import { UserList, UserPage } from './components/user'
import { TestPage } from './components/test-components'
import { StatsPage } from './components/stats'
import { RolesPage } from './components/roles'

import 'element-theme-default'
import { CategoriesList, CategoriesRename } from './components/categories'
import {
  PathTemplateForm,
  PathTemplateEdit,
  PathTemplateList
} from './components/path-templates'
import {
  FulfillmentRequestList,
  HandleFulfillmentRequest
} from './components/fulfillment-request'

const withStoreQuery = graphql(storeQuery)

const App = () => (
  <React.Fragment>
    <Authenticate>
      <SidebarNav />
      <div className='content'>
        <Switch>
          <Route exact path='/' component={LearningContentList} />
          <Route
            exact
            path='/learning-content/:learningContentId/edit'
            component={LearningContentEdit}
          />
          <Route
            exact
            path='/learning-content/rated'
            component={LearningContentRatings}
          />

          <Route path='/learning-content' component={LearningContentList} />
          <Route path='/digest' component={DigestRequest} />
          <Route
            exact
            path='/organizations/:slug/:organizationId'
            component={OrganizationPage}
          />
          <Route
            exact
            path='/organizations/:slug/:organizationId/edit'
            component={OrganizationEdit}
          />
          <Route
            exact
            path='/organizations/:slug/:organizationId/add-content/:skillId'
            component={LearningContentOrganization}
          />
          <Route
            exact
            path='/organizations/:slug/:organizationId/set-category/:skillId'
            component={SetCustomSkillCategory}
          />
          <Route
            exact
            path='/organizations/:slug/:organizationId/:teamId'
            component={OrganizationTeamView}
          />
          <Route exact path='/skills' component={SkillsList} />
          <Route exact path='/skills/:skillId/edit' component={SkillsEdit} />
          {/* <Route path="/team-content" component={TeamContentPage} /> */}
          <Route path='/organizations' component={OrganizationList} />
          <Route exact path='/users/:id' component={UserPage} />
          <Route path='/users' component={UserList} />
          <Route exact path='/content-sources' component={SourcesList} />
          <Route
            exact
            path='/content-sources/:sourceId/edit'
            component={SourceEdit}
          />
          <Route
            exact
            path='/frameworks/:frameworkId/edit'
            component={EditSkillsFramework}
          />
          <Route exact path='/tests' component={TestPage} />
          <Route exact path='/stats' component={StatsPage} />
          <Route exact path='/roles' component={RolesPage} />
          <Route
            exact
            path='/skill-categories/:categoryId/rename'
            component={CategoriesRename}
          />
          <Route path='/skill-categories' component={CategoriesList} />
          <Route exact path='/test' component={TestPage} />
          <Route
            exact
            path='/path-templates/create'
            component={() => <PathTemplateForm />}
          />
          <Route
            exact
            path='/path-templates'
            component={() => <PathTemplateList />}
          />
          <Route
            exact
            path='/path-templates/edit/:pathId'
            component={() => <PathTemplateEdit />}
          />
          <Route
            exact
            path='/requests'
            component={() => <FulfillmentRequestList />}
          />
          <Route
            exact
            path='/request/:requestId'
            component={() => <HandleFulfillmentRequest />}
          />
          <Route>
            <Redirect to='/error-page/404' />
          </Route>
        </Switch>
      </div>
    </Authenticate>
    <style jsx global>{`
      .content {
        margin: 40px auto;
        flex: 0 1 80%;
      }
    `}</style>
  </React.Fragment>
)

export default withStoreQuery(App)
