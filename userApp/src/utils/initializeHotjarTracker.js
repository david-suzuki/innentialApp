const initializeHotjarTracker = ({ organizationName, id, admin, leader }) => {
  // HOTJAR TRACKING SCRIPT FOR app.innential.com
  ;(function(h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function() {
        ;(h.hj.q = h.hj.q || []).push(arguments)
      }
    h._hjSettings = { hjid: 1799678, hjsv: 6 }
    a = o.getElementsByTagName('head')[0]
    r = o.createElement('script')
    r.async = 1
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
    a.appendChild(r)
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')

  // ADD METRICS
  window.hj('identify', id, {
    // USE REAL ID AS OF 04.10.21
    'Organization Name': organizationName,
    Admin: admin,
    Leader: leader
  })
}

export default initializeHotjarTracker
