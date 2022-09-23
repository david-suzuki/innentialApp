export const pdfHtml = ({
  teamName,
  teamCount,
  stageResultInfo: {
    createdAt,
    closedAt,
    stage,
    engagement,
    keyPerformance: {
      goalsManagement,
      independence,
      rolesClarity,
      structure,
      leadership,
      comsAndFeedback,
      planningAndDecisionMaking,
      followUps,
      acceptanceAndNorms,
      cooperation
    },
    betterThan,
    lowestPerformanceAreas
  }
}) => {
  return `
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <title>Another test</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800);
  </style>
  <script>
    var graphData = [     
      ${goalsManagement},
      ${independence},
      ${rolesClarity},
      ${structure},
      ${leadership},
      ${comsAndFeedback},
      ${planningAndDecisionMaking},
      ${followUps},
      ${acceptanceAndNorms},
      ${cooperation}
    ]

    var graphLabels = [
      "Goals Management",
      "Independence",
      "Roles Clarity",
      "Structure",
      "Leadership",
      "Coms And Feedback",
      "Planning And Decision Making",
      "Follow Ups",
      "Acceptance And Norms",
      "Cooperation"
    ]

    var graphDataPct = [     
      ${goalsManagement / 10},
      ${independence / 10},
      ${rolesClarity / 10},
      ${structure / 10},
      ${leadership / 10},
      ${comsAndFeedback / 10},
      ${planningAndDecisionMaking / 10},
      ${followUps / 10},
      ${acceptanceAndNorms / 10},
      ${cooperation / 10}
    ]

    var percentColors = [
      { pct: 0.2, color: { r: 251, g: 108, b: 108 } },
      { pct: 0.7, color: { r: 214, g: 207, b: 136 } },
      { pct: 1.0, color: { r: 111, g: 201, b: 125 } } ];

    var getColorForPercentage = function(pct, alpha) {
      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgba(' + [color.r, color.g, color.b].join(',') + ', ' + alpha + ')';
    }

    var barColors = graphDataPct.map(function (pct) {
      return getColorForPercentage(pct, 0.8)
    })

  </script>
  <style type="text/css">
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      -webkit-print-color-adjust: exact;
    }

    body {
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
    }

    a {
      font-size: 12px;
      color: #5a55ab;
      text-decoration: none;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
    }

    h4 {
      font-size: 12px;
      font-weight: 300;
    }

    h5 {
      font-size: 12px;
      font-weight: 300;
    }

    p {
      font-size: 13px;
      padding: 15px 0;
      line-height: 1.6;
    }

    .container {
      max-width: 820px;
      background-color: #ffffff;
    }

    .container-narrow {
      padding: 65px 80px 0;
    }

    .container-narrow h2 {
      padding: 25px 0 0;
    }

    .container-narrow h3 {
      padding: 25px 0 0;
      font-weight: 600;
    }

    .container-narrow h4 {
      padding: 8px 0 0;
      font-weight: 600;
    }

    .page {
      width: 100%;
      height: 1122px;
    }

    .page-header {
      background-color: #5a55ab;
      width: 100%;
      display: flex;
      color: white;
      border-top: 1px solid transparent;
    }

    .page-header__space {
      width: 36px;
      border-right: 2px solid white;
    }

    .page-header__title {
      width: 100%;
      margin: 15px 0 10px 10px;
    }

    .page-header__assessment-wrapper {
      display: flex;
      border-top: 1px solid white;
    }

    .page-header__assessment-wrapper>div {
      border-right: 1px solid white;
    }

    .page-header__assessment-info {
      width: 335px;
    }

    .page-header__assessment-info-item {
      padding: 10px 7px 7px;
      display: flex;
    }

    .page-header__assessment-info-item:not(:first-child) {
      border-top: 1px solid white;
    }

    .page-header__assessment-label,
    .page-header__assessment-label h5 {
      width: 155px;
    }

    .page-header__assessment-value {
      width: 100%;
      text-align: left;
    }

    .page-header__assessment-stage {
      padding: 7px;
      width: 115px;
    }

    .page-header__assessment-stage h3 {
      padding-top: 8px;
    }

    .page-header__brand {
      width: 190px;
      padding: 10px 15px 5px;
      position: relative;
    }

    .page-header__brand .page-header__brand-pager {
      position: absolute;
      bottom: 5px;
      right: 15px;
    }

    .purple-wrapper {
      background-color: #5a55ab;
      color: white;
      padding: 10px 30px 20px;
      margin: 20px 0 20px;
    }

    .purple-wrapper ul {
      margin: 10px 10px 20px 50px;
    }

    .purple-wrapper ul li {
      font-size: 13px;
      font-weight: 300;
    }

    .purple-wrapper h3 {
      margin: 20px 0 0;
      font-weight: 500;
      padding: 0;
    }

    .bar-container {
      padding-top: 20px;
      width: 100%;
      text-align: center;
    }

    /* helpers */
    .text-center {
      text-align: center;
    }

    .text-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    .text-purple {
      color: #5a55ab;
    }
  </style>
  <style type="text/css">
    /* Chart.js */
    @-webkit-keyframes chartjs-render-animation {
      from {
        opacity: 0.99
      }

      to {
        opacity: 1
      }
    }

    @keyframes chartjs-render-animation {
      from {
        opacity: 0.99
      }

      to {
        opacity: 1
      }
    }

    .chartjs-render-monitor {
      -webkit-animation: chartjs-render-animation 0.001s;
      animation: chartjs-render-animation 0.001s;
    }
  </style>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root">
    <div>
      <div class="container">
        <div class="page">
          <div class="page-header">
            <div class="page-header__space"></div>
            <div class="page-header__team-wrapper">
              <h2 class="page-header__title">Team Stage Report</h2>
              <div class="page-header__assessment-wrapper">
                <div class="page-header__assessment-info">
                  <div class="page-header__assessment-info-item">
                    <div class="page-header__assessment-label">
                      <h5>Assessed group:</h5>
                    </div>
                    <div class="page-header__assessment-value">
                      <h5>${
                        teamName.includes('Team')
                          ? teamName
                          : 'Team ' + teamName
                      } (${teamCount} people)</h5>
                    </div>
                  </div>
                  <div class="page-header__assessment-info-item">
                    <div class="page-header__assessment-label">
                      <h5>Assessment date:</h5>
                    </div>
                    <div class="page-header__assessment-value">
                      <h5>${createdAt.toDateString()}</h5>
                    </div>
                  </div>
                </div>
                <div class="page-header__assessment-stage">
                  <h5>Team stage:</h5>
                  <h3 class="text-center">${stage}</h3>
                </div>
                <div class="page-header__assessment-stage">
                  <h5>Engagement:</h5>
                  <h3 class="text-center">${Math.round(engagement * 10)}%</h3>
                </div>
              </div>
            </div>
            <div class="page-header__brand text-right">
              <h3 class="page-header__brand-name">Innential</h3>
              <h4 class="page-header__brand-date">${closedAt.toDateString()}</h4>
              <h4 class="page-header__brand-pager">Page (1/4)</h4>
            </div>
          </div>
          <div class="container-narrow">
            <h2>Overview</h2>
            <p>Teams operate in one of four stages of development. These stages are: <b>Forming (1) Storming (2),
                Norming (3), Performing (4)</b>.</p>
            <p>Teams in stage 4 achieve much better business results and enjoy greater job satisfaction when compared to
              teams operating in the other stages. <b>Our objective is to help you get there.</b></p>
            <p><b>Your team is in ${stage.toLowerCase()}</b>. See details of how your stage is reflected in your scores in the <b>10
                Key Areas of Team Performance,</b> to see what elements and processes can be improved, on your way to
              Stage 4. The results are presented on the scale from 0-100% (max). The same rule applies to engagement.
            </p>
            <p>Employee engagement is the emotional commitment the employee has to the organisation and its goals. Your
              Engagement score is ${Math.round(engagement * 10)}% ${
    betterThan > 0
      ? ", and it's better than " +
        Math.round(betterThan) +
        '% of the teams in our database.'
      : '.'
  }</p><a href="http://magazine.innential.com/how-to-build-effective-teams/"
              target="_blank">Read more about the model here &gt;</a>
            <h2>Your results in 10 Key Areas of Team Performance</h2>
            <div class="bar-container"> <canvas /> </div>
          </div>
        </div>
        <div class="page">
        <div class="page-header">
        <div class="page-header__space"></div>
        <div class="page-header__team-wrapper">
          <h2 class="page-header__title">Team Stage Report</h2>
          <div class="page-header__assessment-wrapper">
            <div class="page-header__assessment-info">
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessed group:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${
                    teamName.includes('Team') ? teamName : 'Team ' + teamName
                  } (${teamCount} people)</h5>
                </div>
              </div>
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessment date:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${createdAt.toDateString()}</h5>
                </div>
              </div>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Team stage:</h5>
              <h3 class="text-center">${stage}</h3>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Engagement:</h5>
              <h3 class="text-center">${Math.round(engagement * 10)}%</h3>
            </div>
          </div>
        </div>
        <div class="page-header__brand text-right">
          <h3 class="page-header__brand-name">Innential</h3>
          <h4 class="page-header__brand-date">${closedAt.toDateString()}</h4>
          <h4 class="page-header__brand-pager">Page (2/4)</h4>
        </div>
      </div>
          <div class="container-narrow">
            <h2 class="text-purple">10 Key Areas of Team Performance in details</h2>
            <h4><b>How to read the results? The percentage value indicates the potential, in a certain dimension,
                your<br>team is currently using.</b></h4>
            <h3>${Math.round(goalsManagement * 10)}% Goals Management</h3>
            <p>Clarity regarding goals and a common vision of how to accomplish them is crucial if the team is to
              succeed. Until everyone is clear about goals, the motivation to accomplish them will be low, which
              decreases efficiency.</p>
            <h3>${Math.round(independence * 10)}% Interdependence</h3>
            <p>Effective teams plan tasks so that they require people to work together as a unit and in subgroups, in
              order to increase the efficiency of task accomplishment. The objective is that the division of work takes
              place naturally and the cooperation becomes more evident.</p>
            <h3>${Math.round(
              acceptanceAndNorms * 10
            )}% Norms and Acceptance to different behaviours</h3>
            <p>Effective teams champion norms that encourage creativity, innovation and success. As long as members
              bring agreed value to tasks, personal differences are fully accepted and the members are granted personal
              freedom.</p>
            <h3>${Math.round(structure * 10)}% Structure</h3>
            <p>Effective teams have the optimum number of members needed to address the objectives. Working in subgroups
              is accepted and encouraged and they are naturally integrated into the team as a whole.</p>
            <h3>${Math.round(rolesClarity * 10)}% Roles Clarity</h3>
            <p>Once the goals are clarified, the team should organize itself - deciding what needs to be done, and who
              will do it. The tasks should be clearly defined and assigned to people who have the appropriate
              competencies. It is important for the team to be aware of individual skills, experiences and preferences.
            </p>
          </div>
        </div>
        <div class="page">
        <div class="page-header">
        <div class="page-header__space"></div>
        <div class="page-header__team-wrapper">
          <h2 class="page-header__title">Team Stage Report</h2>
          <div class="page-header__assessment-wrapper">
            <div class="page-header__assessment-info">
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessed group:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${
                    teamName.includes('Team') ? teamName : 'Team ' + teamName
                  } (${teamCount} people)</h5>
                </div>
              </div>
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessment date:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${createdAt.toDateString()}</h5>
                </div>
              </div>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Team stage:</h5>
              <h3 class="text-center">${stage}</h3>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Engagement:</h5>
              <h3 class="text-center">${Math.round(engagement * 10)}%</h3>
            </div>
          </div>
        </div>
        <div class="page-header__brand text-right">
          <h3 class="page-header__brand-name">Innential</h3>
          <h4 class="page-header__brand-date">${closedAt.toDateString()}</h4>
          <h4 class="page-header__brand-pager">Page (3/4)</h4>
        </div>
      </div>
          <div class="container-narrow">
            <h3>${Math.round(leadership * 10)}% Leadership</h3>
            <p>In effective teams, the leader’s style adjusts to the group’s needs. The leadership style for different
              stages should therefore vary accordingly. If the leader does not adjust in this way, the group will not
              develop into a high performing team. If your team is a ‘self-managing’ team - without designated leader,
              please skip the dimension in your analysis.</p>
            <h3>${Math.round(
              comsAndFeedback * 10
            )}% Communication and Feedback</h3>
            <p>Effective teams communicate openly, listen to one another regardless of personal differences and use
              feedback that is targeted on objectives and the task at hand. Such feedback is regular and intended to
              lead to the changes needed to make the team more efficient.</p>
            <h3>${Math.round(
              planningAndDecisionMaking * 10
            )}% Discussion, Decision Making, Planning</h3>
            <p>Effective teams plan how they will make decisions before they take them, and openly discuss current
              challenges and problems</p>
            <h3>${Math.round(
              followUps * 10
            )}% Follow-up from decision to implementation</h3>
            <p>Effective teams implement agreed solutions and stick to what has been agreed</p>
            <h3>${Math.round(
              cooperation * 10
            )}% Cooperation and conflict management</h3>
            <p>Effective teams are cohesive - their members cooperate with one another, even if their perspectives on
              how to successfully accomplish the task differ greatly. Periods of conflict are frequent but brief and the
              team operates together towards the goals that have been set.</p>
          </div>
        </div>
        <div class="page">
        <div class="page-header">
        <div class="page-header__space"></div>
        <div class="page-header__team-wrapper">
          <h2 class="page-header__title">Team Stage Report</h2>
          <div class="page-header__assessment-wrapper">
            <div class="page-header__assessment-info">
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessed group:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${
                    teamName.includes('Team') ? teamName : 'Team ' + teamName
                  } (${teamCount} people)</h5>
                </div>
              </div>
              <div class="page-header__assessment-info-item">
                <div class="page-header__assessment-label">
                  <h5>Assessment date:</h5>
                </div>
                <div class="page-header__assessment-value">
                  <h5>${createdAt.toDateString()}</h5>
                </div>
              </div>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Team stage:</h5>
              <h3 class="text-center">${stage}</h3>
            </div>
            <div class="page-header__assessment-stage">
              <h5>Engagement:</h5>
              <h3 class="text-center">${Math.round(engagement * 10)}%</h3>
            </div>
          </div>
        </div>
        <div class="page-header__brand text-right">
          <h3 class="page-header__brand-name">Innential</h3>
          <h4 class="page-header__brand-date">${closedAt.toDateString()}</h4>
          <h4 class="page-header__brand-pager">Page (4/4)</h4>
        </div>
      </div>
          <div class="container-narrow">
            <h2>Your Development towards Stage 4</h2>
            <h2 class="text-purple">Key Performance Areas to address:</h2>
            <div class="purple-wrapper">
            ${lowestPerformanceAreas
              .map(
                area =>
                  `<h3>${area.label}</h3>
                <ul>
                  <li>${area.tip}</li>
                </ul>`
              )
              .join('')}
            </div>
            <h3>Will you work with coaches or will you do the process solely yourself?</h3>
            <p>If you work with coaches and/or facilitators (internal and/or external), we strongly recommend discussing
              the scores with them. Results of these assessments, however valuable and actionable, do not answer all the
              questions. Having the support of an experienced coach might help you develop faster.<br>Don't worry if you
              don't have such support, we will provide you with a lot of tools, methods as well as with relevant content
              to empower you in your journey to build a high-performing team.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
  `
}
