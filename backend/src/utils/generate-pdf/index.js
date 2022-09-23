// import { pdfHtml } from './rawHtml'
// import { s3 } from '../'
// import puppeteer from 'puppeteer'

// export const createPdf = async ({
//   teamName,
//   teamCount,
//   stageResultInfo,
//   organizationName
// }) => {
//   const puppeteerArgs = {
//     args: [
//       '-webkit-print-color-adjust', // Required for Docker version of Puppeteer
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       // This will write shared memory files into /tmp instead of /dev/shm,
//       // because Docker’s default for /dev/shm is 64MB
//       '--disable-dev-shm-usage'
//     ]
//   }
//   const pdfOptions = {
//     format: 'A4',
//     printBackgroud: true
//   }

//   const browser = await puppeteer.launch(puppeteerArgs)
//   const page = await browser.newPage()
//   await page.setContent(
//     pdfHtml({
//       teamName,
//       teamCount,
//       stageResultInfo
//     }),
//     { waitUntil: 'domcontentloaded' }
//   )

//   await page.evaluate(() => {
//     var cnv = document.querySelector('canvas')
//     if (cnv.getContext) {
//       var ctx = cnv.getContext('2d')

//       // eslint-disable-next-line
//       var myChart = new window.Chart(ctx, {
//         type: 'bar',
//         data: {
//           labels: window.graphLabels,
//           datasets: [
//             {
//               data: window.graphData,
//               backgroundColor: window.barColors
//             }
//           ]
//         },
//         options: {
//           scales: {
//             yAxes: [
//               {
//                 gridLines: {
//                   display: false
//                 },
//                 ticks: {
//                   callback: function(value, index, values) {
//                     return `${value * 10} %`
//                   },
//                   beginAtZero: true,
//                   fontStyle: 'inherit'
//                 }
//               }
//             ],
//             xAxes: [
//               {
//                 gridLines: {
//                   display: false
//                 },
//                 barPercentage: 0.2,
//                 ticks: {
//                   beginAtZero: true,
//                   fontFamily: 'Poppins',
//                   fontSize: 8
//                 }
//               }
//             ]
//           },
//           legend: {
//             display: false
//           }
//         }
//       })
//     }
//   })

//   await page.waitFor(2000)
//   await page.pdf(pdfOptions).then(
//     pdf => {
//       s3.upload(
//         {
//           Bucket: process.env.S3_BUCKET,
//           Key: `${organizationName}/teams/${teamName}/reports/${
//             stageResultInfo._id
//           }.pdf`,
//           Body: pdf,
//           ContentType: 'application/pdf'
//         },
//         {},
//         (err, data) => {
//           if (err) console.log(err)
//           if (data) console.log(data)
//         }
//       )
//     },
//     err => {
//       console.log(err)
//     }
//   )

//   await page.close()
//   await browser.close()
// }
