import templateStyle from './templateCss'

export default ({ title, content }) => `
<div class="email-preview">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" id="bodyTable" style="height:100%;">
    <tbody>
      <tr>
        <td align="center" valign="top" id="bodyCell">
          <!-- BEGIN TEMPLATE // -->
          <!--[if gte mso 9]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
              <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
                  <![endif]-->
          <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
            <!-- BEGIN HEADER // -->
            <tbody>
              <tr>
                <td class="img-container mobile" valign="top" id="templateHeader" width="100%">
                  <!-- BEGIN MODULE: HEADER IMAGE // -->
                  <img
                    src="https://gallery.mailchimp.com/d2a6efa94edca01999b754c77/images/a5805e8d-fce7-4a6b-9b57-9dcc5b658113.jpg"
                    width="600" class="templateImage" alt="newsletter_header.jpg" />
                  <!-- // END MODULE: HEADER IMAGE -->
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <!-- // END HEADER -->
      <!-- BEGIN BODY // -->

      <!-- EMAIL TITLE -->
      <tr>
        <td align="center" valign="top">
          <table width="600" border="0" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td align="center" valign="top" class="hidden"></td>
                <td width="600" class="container" bgcolor="#ffffff">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td align="center" valign="top">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td align="center" class="email-title" valign="top">
                                  <p>${title}</p>
                                </td>
                              </tr>
                              <tr>
                                <td height="4" align="center" valign="middle">
                                  <img
                                    src="https://gallery.mailchimp.com/d2a6efa94edca01999b754c77/images/79143a5d-adb5-49da-ac4c-d74b34e178a7.png"
                                    width="154" height="4" alt="subtitle_bar.png" />
                                </td>
                              </tr>
                              <tr>
                                <td height="20" align="left" valign="top"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td align="center" valign="top" class="hidden"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <!-- END EMAIL TITLE -->

      <!-- BEGIN EMAIL CONTENT -->
      <tr>
        <td align="center" valign="top">
          <table width="600" border="0" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td align="center" valign="top" class="hidden"></td>
                <td width="600" class="container" bgcolor="#ffffff">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td align="center" valign="top">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td align="center" width="600" class="email-content" valign="top">
                                  <div>
                                    ${content}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td height="4" align="center" valign="middle">
                                  <img
                                    src="https://gallery.mailchimp.com/d2a6efa94edca01999b754c77/images/79143a5d-adb5-49da-ac4c-d74b34e178a7.png"
                                    width="154" height="4" alt="subtitle_bar.png" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td align="center" valign="top" class="hidden"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <!-- END EMAIL CONTENT-->

      <!-- NEW FOOTER// -->
      <tr class="bg-white--mobile">
        <td align="center" valign="top">
          <table width="600" border="0" cellspacing="0" cellpadding="0">
            <tbody>
              <!-- <tr>
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
                </tr> -->
              <tr>
                <!-- <td align="center" valign="top" class="hidden"></td> -->
                <!-- <td
                    align="right"
                    width="30"
                    valign="top"
                    class="hidden"
                    bgcolor="#EDF2F5"
                  ></td> -->
                <td width="540" class="container" bgcolor="#ffffff">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td class="hidden" width="20" align="left" valign="top" bgcolor="#ffffff"></td>
                        <td class="adjustment display-block" align="left" valign="top">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td height="20" align="left" valign="top"></td>
                              </tr>

                              <tr>
                                <td class="show" width="10" align="left" valign="top"></td>
                                <td class="hidden" width="35" align="left" valign="top"></td>
                                <td class="hidden" valign="middle" width="90">
                                  <span>Follow us:</span>
                                </td>
                                <td class="social-icons" height="29" valign="middle">
                                  <a class="utilityLink"><img
                                      src="https://gallery.mailchimp.com/d2a6efa94edca01999b754c77/images/103e71ae-2c84-4d49-af87-0b607bd1ae02.png"
                                      alt="Follow on Facebook" width="29" height="29" /></a>
                                  <span class="mobileHide">&nbsp;</span>
                                  <a class="utilityLink"><img
                                      src="https://gallery.mailchimp.com/d2a6efa94edca01999b754c77/images/9139d25f-62b1-47d0-8aab-bb023ca553cc.png"
                                      alt="Follow on Linkedin" width="29" height="29" /></a>
                                </td>
                                <td valign="middle" align="right" class="contact-email">
                                  <a>contact@innential.com</a>
                                </td>
                                <td class="hidden" width="35" align="left" valign="top"></td>
                                <td class="show" width="10" align="left" valign="top"></td>
                              </tr>

                              <tr>
                                <td height="20" align="left" valign="top"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="hidden" width="20" align="left" valign="top" bgcolor="#ffffff"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <!-- <td
                    align="left"
                    width="30"
                    valign="top"
                    class="hidden"
                    bgcolor="#EDF2F5"
                  ></td>
                  <td align="center" valign="top" class="hidden"></td> -->
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <!-- // NEW FOOTER-->
      <!-- // END TEMPLATE -->
    </tbody>
  </table>
  <style type="text/css">
    ${templateStyle}
  </style>
</div>
`
