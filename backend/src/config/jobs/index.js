import * as all from './*'

/* MAKE SURE TO REFRESH THIS FILE WHEN YOU ADD NEW JOBS TO THE AGENDA ROSTER */

const allJobs = Object.values(all).filter(v => !!v)

export default allJobs
