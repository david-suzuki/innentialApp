# Innential

Ecosystem:
- Apollo Server (with Express)
- Apollo Client 2.0
- React (frontend web client)


## Setup instructions

### Requirements

- **Node Version Manager** - please check https://github.com/Gizra/KnowledgeBase/wiki/How-to-install-nvm-(Node-Version-Manager) for the installation guide
- **Yarn ^1.7** - make sure that you have version 1.7 or later installed
- **Mongodb** - installation and running instructions: https://docs.mongodb.com/manual/installation/

### Steps

#### 1. Clone the repo

```
git clone git@github.com:mvpspace/innentialApp.git
```

#### 2. Set correct version of node

Navigate to root of the project and run a following command:

```
nvm use
```


#### 3. Install all dependencies

Also from the root, run the following command:

```
yarn install-all
```

#### 4. Configure environment variables

Create new file at `./backend/env/.env` and ask someone from a team of developers to
send you all secret keys required to run a project. Put them here.

#### 5. Import a database (Skip if you don't need the content)

Ask someone from a team for a file with staging database dump. With use of any
Mongo IDE ([NoSQLBooster](https://nosqlbooster.com/) is suggested), import all
data into `innential` database.

Hint: for NoSQLBooster, right click on databse, then use Mongo Utilities ->
mongorestore. Make sure that import drops all existing data first.

#### 6. Run dev server

Run a server for the first time. From the root folder, begin with

```
cd backend
nvm use
yarn start
```

see if the server starts correctly, without throwing any errors. If it does, create two more terminal windows from the root folder and input

```
cd adminApp
yarn run dev
```

or 

```
cd userApp
yarn run dev
```

## Usage

### USERS
There is currently a single superuser added via fixtures to the db.
This user account is for accessing the adminApp only! When trying it in the userApp it won't work. Use this account to access the admin panel, and then create your organization there.

[Admin role]

email: kris@waat.eu

password: 123456


### SETTING UP YOUR OWN USERS
If you have the env variables, go to localhost:8081/organizations and create an organization with a valid email address.

You can use `+` to invite more users using the same email address (i.e. myemail+1@email.com).

You should receive an email redirecting you to localhost:8082, where you will go through the onboarding process.

### APOLLO GRAPHQL COMPONENTS
You may create new graphql components just by typing from project's root folder:

`cd backend`

`yarn add-component-part <component_name> <component_part>`

Ex. `yarn add-component-part User user-authentication`

The above will create under `components` a new folder named `User` with a subfolder named
`user-authentication`

`user-authentication` has all files needed to implement your component. You just need to fill them;

- `_input.js`: input types you need for your component part's mutations
- `_mutation.js`: all mutations for this component part go here
- `_query.js`: all queries for this component part go here
- `_type.js`: all types and type resolvers for this component part go here

You may implement only what you need, though you should never delete any of these files. For example
if you have no mutations and no inputs for a component part you should not delete _input.js and
mutations.js. Just leave them there as they were created by the script.

Each component has at least one part, though it can have many.

Ex.
components
```
- components
-- User
--- user-authentication
--- user-data
```

You may want to delete an existing graphql components just by typing from project's root folder:

`cd backend`

`yarn remove-component-part <component_name> <component_part>`

Ex. `yarn remove-component-part User user-authentication`

The above will delete under `components` in the folder named `User` the subfolder named
`user-authentication`

Moreover if the folder named `User` has no more sub-part it will be deleted by the script as well

Otherwise the server/nodemon may not immediately pick up changes in components' structure and even
throw errors (for example adding/deleting components manually),


# SSL CERT UPDATES

Consult Rico for that one (@ecerroni)
