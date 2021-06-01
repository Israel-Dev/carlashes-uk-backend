import sgMail from '@sendgrid/mail'
import TreatmentService from './treatment.service'

const {
    SEND_GRID_API_KEY,
    SEND_GRID_TO_EMAIL,
    SEND_GRID_FROM_EMAIL,
    WEBSITE
} = process.env

sgMail.setApiKey(SEND_GRID_API_KEY as string)

const SENDER_NAME = "Carlashes - UK"
const SENDER_ADDRESS = "602 Canterbury house 1"
const SENDER_CITY = "Honours Gardens"
const SENDER_ZIP_CODE = "rm8 2Gf"
const INSTAGRAM_URL = "https://www.instagram.com/carlashes_/?r=nametag"

class EmailService {
    async sendRequestToClient(
        FStartDate: Date,
        FEndDate: Date,
        treatmentName: string,
        clientName: string,
        email: string
    ) {
        try {
            // Send email to bussiness with the appointment request information
            const msg = {
                to: email,
                from: SEND_GRID_FROM_EMAIL as string,
                subject: "Request received | Carlashes - UK",
                html: `
                <div style="text-align: center; width: 100%; max-width: 700px;">
                    <div style="background-color: white;">
                        <h2 style="color: #498999">Carlashes - UK</h2>
                        <h3 style="color: #498999">Your request was sent, ${clientName}</h3>
                        <p>As soon as we can, we'll confirm your appointment and you'll be notified.</p>
                    </div>
                    <div style="background-color: #FFE2C7;">
                        <table style="width:100%" style="text-align: center; margin: 25px 0; border: solid 1px #595858d1;">
                            <tr style="text-align: center; color: #498999; border: solid 1px #595858d1;">
                                <th style="border: solid 1px #595858d1;">Start Time</th>
                                <th style="border: solid 1px #595858d1;">End Time</th>
                                <th style="border: solid 1px #595858d1;">Treatment</th>
                                <th style="border: solid 1px #595858d1;">Client Name</th>
                            </tr>
                            <tr style="text-align: center;">
                                <td style="border: solid 1px #595858d1;">${FStartDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${FEndDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${treatmentName}</td>
                                <td style="border: solid 1px #595858d1;">${clientName}</td>
                            </tr>
                        </table>
                        <br />
                        <br />
                    </div>
                    <small>This email was sent from ${WEBSITE}</small>
                </div>
            `
            }

            await sgMail.send(msg)
            return true
        } catch (e) {
            console.error(e)
            if (e.message) console.error(e.response.body)
        }
    }

    async sendEventRequest(
        FStartDate: Date,
        FEndDate: Date,
        treatmentName: string,
        clientName: string,
        email: string,
        phoneNumber: string,
        eventRef: string
    ) {
        try {
            // Send email to bussiness with the appointment request information
            const msg = {
                to: SEND_GRID_TO_EMAIL as string,
                from: SEND_GRID_FROM_EMAIL as string,
                subject: `New appointment request | ${clientName}`,
                html: `
                <div style="text-align: center; width: 100%; max-width: 700px;">
                    <div style="background-color: white;">
                        <h2 style="color: #498999">Carlashes - UK</h2>
                        <h3 style="color: #498999">New Appointment for - ${clientName}</h3>
                    </div>
                    <div style="background-color: #FFE2C7;">
                        <table style="width:100%" style="text-align: center; margin: 25px 0; border: solid 1px #595858d1;">
                            <tr style="text-align: center; color: #498999; border: solid 1px #595858d1;">
                                <th style="border: solid 1px #595858d1;">Start Time</th>
                                <th style="border: solid 1px #595858d1;">End Time</th>
                                <th style="border: solid 1px #595858d1;">Treatment</th>
                                <th style="border: solid 1px #595858d1;">Client Name</th>
                                <th style="border: solid 1px #595858d1;">Email</th>
                                <th style="border: solid 1px #595858d1;">Phone Number</th>
                            </tr>
                            <tr style="text-align: center;">
                                <td style="border: solid 1px #595858d1;">${FStartDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${FEndDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${treatmentName}</td>
                                <td style="border: solid 1px #595858d1;">${clientName}</td>
                                <td style="border: solid 1px #595858d1;">${email}</td>
                                <td style="border: solid 1px #595858d1;">${phoneNumber}</td>
                            </tr>
                        </table>
                        <br />
                        <br />
                        <a href="${WEBSITE}/appointment-confirmed?event_ref=${eventRef}" target="_blank" style="background-color: #498999; color: white; padding: 15px; border-radius: 10px;">
                            Confirm appointment
                        </a>
                        <br />
                        <br />
                        <br />
                    </div>
                    <small>This email was sent from ${WEBSITE}</small>
                </div>
            `
            }

            await sgMail.send(msg)
            return true
        } catch (e) {
            console.error(e)
            if (e.message) console.error(e.response.body)
        }
    }

    async sendEventConfirmation(
        FStartDate: Date,
        FEndDate: Date,
        details: { clientName: string, phoneNumber: string, email: string, treatmentName: string }
    ) {
        try {

            // Sending email to client confirming appointment
            const msg = {
                to: details.email,
                from: SEND_GRID_FROM_EMAIL as string,
                subject: "Appointment Confirmation | Carlashes - UK",
                html: `
                <div style="text-align: center; width: 100%; max-width: 700px;">
                    <div style="background-color: white;">
                        <h2 style="color: #498999">Carlashes - UK </h2>
                        <h3 style="color: #498999">
                            <u>
                                Your appointment is confirmed, ${details.clientName}!
                            </u>
                            <p>See you soon ;)</p>
                        </h3>
                    </div>
                    <div style="background-color: #FFE2C7;">
                        <table style="width:100%" style="text-align: center; margin: 25px 0; border: solid 1px #595858d1;">
                            <tr style="text-align: center; color: #498999; border: solid 1px #595858d1;">
                                <th style="border: solid 1px #595858d1;">Start Time</th>
                                <th style="border: solid 1px #595858d1;">End Time</th>
                                <th style="border: solid 1px #595858d1;">Treatment</th>
                                <th style="border: solid 1px #595858d1;">Name</th>
                            </tr>
                            <tr style="text-align: center;">
                                <td style="border: solid 1px #595858d1;">${FStartDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${FEndDate.toLocaleString('en-GB')}</td>
                                <td style="border: solid 1px #595858d1;">${details.treatmentName}</td>
                                <td style="border: solid 1px #595858d1;">${details.clientName}</td>
                            </tr>
                        </table>
                        <br />
                        <br />
                        <br />
                    </div>
                    <small>This email was sent from ${WEBSITE}</small>
                </div>
            `
            }

            await sgMail.send(msg)
        } catch (e) {
            console.error(e)
        }
    }

    async sendPaymentConfirmation(orderData: { clientEmail: string, orderRef: string, orderTotalPrice: number | string, products: any[] }) {
        try {
            const imagesElem = `
            <tr>
                <td
                    style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"
                    valign="top" align="center">
                        <img class="max-width" border="0"
                        style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;"
                        width="290" alt="" data-proportionally-constrained="true"
                        data-responsive="true"
                        src="${orderData.products[0].mainImage}">
                </td>
            </tr>
            `
            console.log("here ->", orderData.clientEmail)

            const msg = {
                to: orderData.clientEmail,
                from: SEND_GRID_FROM_EMAIL as string,
                subject: "Payment Confirmation | Carlashes - UK",
                html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!--<![endif]-->
  <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
  <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
  <style type="text/css">
    body,
    p,
    div {
      font-family: times new roman, times, serif;
      font-size: 16px;
    }

    body {
      color: #516775;
    }

    body a {
      color: #498999;
      text-decoration: none;
    }

    p {
      margin: 0;
      padding: 0;
    }

    table.wrapper {
      width: 100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    img.max-width {
      max-width: 100% !important;
    }

    .column.of-2 {
      width: 50%;
    }

    .column.of-3 {
      width: 33.333%;
    }

    .column.of-4 {
      width: 25%;
    }

    ul ul ul ul {
      list-style-type: disc !important;
    }

    ol ol {
      list-style-type: lower-roman !important;
    }

    ol ol ol {
      list-style-type: lower-latin !important;
    }

    ol ol ol ol {
      list-style-type: decimal !important;
    }

    @media screen and (max-width:480px) {

      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }

      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }

      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }

      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }

      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }

      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .columns {
        width: 100% !important;
      }

      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
  <!--user entered Head Start-->

  <!--End Head user entered-->
</head>

<body>
  <center class="wrapper" data-link-color="#498999"
    data-body-style="font-size:16px; font-family:times new roman,times,serif; color:#516775; background-color:#FFFFFF;">
    <div class="webkit">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
        <tr>
          <td valign="top" bgcolor="#FFFFFF" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0"
              border="0">
              <tr>
                <td width="100%">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                          style="width:100%; max-width:600px;" align="center">
                          <tr>
                            <td role="modules-container"
                              style="padding:0px 0px 0px 0px; color:#516775; text-align:left;" bgcolor="#FFE2C7"
                              width="100%" align="left">
                              <table class="module preheader preheader-hide" role="module" data-type="preheader"
                                border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                <tr>
                                  <td role="module-content">
                                    <p></p>
                                  </td>
                                </tr>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="751f8306-861f-46da-a604-f28c8a0e69a2" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 0px 0px 0px; line-height:30px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div>
                                        <div style="font-family: inherit; text-align: center"><span
                                            style="color: #498999; font-size: 24px"><strong>Carlashes -
                                              UK</strong></span></div>
                                        <div></div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="beaf3866-2aee-4088-80db-b598278713bd" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 18px 0px; line-height:15px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div>
                                        <div style="font-family: inherit; text-align: center"><span
                                            style="color: #498999"><strong>Your payment is confirmed!</strong></span>
                                        </div>
                                        <br />
                                        <div style="font-family: inherit; text-align: center"><span
                                            style="color: #498999"><strong>Ref. ${orderData.orderRef}</strong></span></div>
                                        <div></div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="bdzDb4B4pnnez4W7L1KpxJ.1">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor="#498999">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF"
                                data-distribution="1,1">
                                <tbody>
                                  <tr role="module-content">
                                    <td height="100%" valign="top">
                                      <table width="290"
                                        style="width:290px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-0">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table class="wrapper" role="module" data-type="image" border="0"
                                                cellpadding="0" cellspacing="0" width="100%"
                                                style="table-layout: fixed;"
                                                data-muid="759c4311-ddbd-4bd5-9b73-3c29c729aad6">
                                                <tbody>
                                                  ${imagesElem}
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table width="290"
                                        style="width:290px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-1">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table class="module" role="module" data-type="text" border="0"
                                                cellpadding="0" cellspacing="0" width="100%"
                                                style="table-layout: fixed;"
                                                data-muid="cfee83f2-346d-48b7-bd08-31376a2c5823"
                                                data-mc-module-version="2019-10-22">
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"
                                                      height="100%" valign="top" bgcolor="" role="module-content">
                                                      <div>
                                                        <div style="font-family: inherit; text-align: inherit"><span
                                                            style="color: #498999; font-family: &quot;times new roman&quot;, times, serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Product
                                                            Ref.: </span><span
                                                            style="font-family: &quot;times new roman&quot;, times, serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">${orderData.products[0].productRef}</span>
                                                        </div>
                                                        <div style="font-family: inherit; text-align: inherit"><span
                                                            style="color: #498999"><strong>Product:</strong></span><strong>
                                                          </strong>${orderData.products[0].name}</div>
                                                        <div style="font-family: inherit; text-align: inherit"><span
                                                            style="color: #498999"><strong>Quantity:</strong></span><strong>
                                                          </strong>${orderData.products[0]._doc.quantity}</div>
                                                        <div style="font-family: inherit; text-align: left"><span
                                                            style="color: #498999"><strong>Total
                                                              Price:</strong></span><strong> &nbsp;</strong>${orderData.orderTotalPrice}
                                                        </div>
                                                        <div></div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="bdzDb4B4pnnez4W7L1KpxJ">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor="#498999">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="0ddf700d-2f61-461f-b9c1-61e2acc6de9e" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td
                                      style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#ffffff;"
                                      height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                      <div>
                                        <div style="font-family: inherit; text-align: center"><span
                                            style="color: #498999; font-size: 18px"><strong>Thanks for trusting
                                              us!</strong></span></div>
                                        <div></div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="divider" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="ei2zeSTvjHYmn1YhKSUfaB">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%"
                                      valign="top" bgcolor="">
                                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                        height="10px" style="line-height:10px; font-size:10px;">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px 0px 10px 0px;" bgcolor="#ffffff"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="81a81688-8480-4773-85f5-80fea9b5770d">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="2q8x8zTfLywQieSSYmZbus" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="">
                                      <div>
                                        <div style="font-family: inherit; text-align: center"><span
                                            style="font-size: 28px; font-family: georgia, serif; color: #498999"><strong>In
                                              need of something else?</strong></span></div>
                                        <div></div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button"
                                data-type="button" role="module" style="table-layout:fixed" width="100%"
                                data-muid="bKHWQMgPkL5opYCkxiM6aS">
                                <tbody>
                                  <tr>
                                    <td align="center" class="outer-td" style="padding:20px 0px 0px 0px;" bgcolor="">
                                      <table border="0" cellpadding="0" cellspacing="0"
                                        class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center">
                                        <tbody>
                                          <tr>
                                            <td align="center" bgcolor="#498999" class="inner-td"
                                              style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                              <a style="background-color:#498999; border:0px solid #498999; border-color:#498999; border-radius:0px; border-width:0px; color:#ffffff; display:inline-block; font-family:verdana,geneva,sans-serif; font-size:16px; font-weight:normal; letter-spacing:1px; line-height:30px; padding:12px 20px 12px 20px; text-align:center; text-decoration:none; border-style:solid;"
                                                href="${WEBSITE}" target="_blank">Continue Shopping!</a></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="81a81688-8480-4773-85f5-80fea9b5770d.1">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="divider" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="qkG1GEG4EZSwoAzbwgoD8v">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%"
                                      valign="top" bgcolor="">
                                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                        height="10px" style="line-height:10px; font-size:10px;">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px 0px 10px 0px;" bgcolor="#ffffff"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="vqDDw7scxs521qMEgEyyuF">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 40px 0px;" role="module-content" bgcolor="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="social" align="center" border="0"
                                cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="811a4d90-5cf8-4edd-afaf-8d7ae129dd7e">
                                <tbody>
                                  <tr>
                                    <td valign="top"
                                      style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px; background-color:#F9F5F2;"
                                      align="center">
                                      <table align="center" style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                                        <tbody>
                                          <tr align="center">
                                            <td style="padding: 0px 5px;" class="social-icon-column">
                                              <a role="social-icon-link" href="https://facebook.com" target="_blank"
                                                alt="Facebook" title="Facebook"
                                                style="display:inline-block; background-color:#516775; height:30px; width:30px; border-radius:30px; -webkit-border-radius:30px; -moz-border-radius:30px;">
                                                <img role="social-icon" alt="Facebook" title="Facebook"
                                                  src="https://mc.sendgrid.com/assets/social/white/facebook.png"
                                                  style="height:30px; width:30px;" height="30" width="30">
                                              </a>
                                            </td>
                                            <td style="padding: 0px 5px;" class="social-icon-column">
                                              <a role="social-icon-link" href="${INSTAGRAM_URL}" target="_blank"
                                                alt="Instagram" title="Instagram"
                                                style="display:inline-block; background-color:#516775; height:30px; width:30px; border-radius:30px; -webkit-border-radius:30px; -moz-border-radius:30px;">
                                                <img role="social-icon" alt="Instagram" title="Instagram"
                                                  src="https://mc.sendgrid.com/assets/social/white/instagram.png"
                                                  style="height:30px; width:30px;" height="30" width="30">
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="f5F8P1n4pQyU8o7DNMMEyW">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe"
                                style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:center;"
                                data-muid="02cb695a-666e-4b9e-9695-12c9fce325d5">
                                <div class="Unsubscribe--addressLine">
                                  <p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;">
                                    ${SENDER_NAME}</p>
                                  <p style="font-size:12px; line-height:20px;"><span
                                      class="Unsubscribe--senderAddress">${SENDER_ADDRESS}</span>, <span
                                      class="Unsubscribe--senderCity">${SENDER_CITY}</span>,<span
                                      class="Unsubscribe--senderZip">${SENDER_ZIP_CODE}</span></p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>

</html>
            `
            }

            await sgMail.send(msg)
        } catch (e) {
            console.error(e)
        }
    }
}

export default new EmailService()