import nodemailer from "nodemailer";
import { env } from "./_core/env";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export interface BookingConfirmationData {
  userEmail: string;
  userName: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Send booking confirmation email to user
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
  const { userEmail, userName, startTime, endTime } = data;

  // Format dates in China timezone
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    }).format(date);
  };

  const startTimeStr = formatDateTime(startTime);
  const endTimeStr = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
  }).format(endTime);

  const mailOptions = {
    from: `"Connie Yu 职业教练" <${env.GMAIL_USER}>`,
    to: userEmail,
    cc: "sw2703@icloud.com", // Also send to coach
    subject: "预约确认 - 职业教练课程",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .booking-details h2 {
            margin-top: 0;
            color: #667eea;
            font-size: 18px;
          }
          .detail-row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #495057;
            display: inline-block;
            width: 80px;
          }
          .detail-value {
            color: #212529;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
          }
          .note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ 预约确认</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">您的职业教练课程已成功预约</p>
        </div>
        
        <div class="content">
          <p>亲爱的 <strong>${userName}</strong>，</p>
          <p>感谢您预约职业教练课程！您的预约已确认，详情如下：</p>
          
          <div class="booking-details">
            <h2>📅 预约详情</h2>
            <div class="detail-row">
              <span class="detail-label">开始时间：</span>
              <span class="detail-value">${startTimeStr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">结束时间：</span>
              <span class="detail-value">${endTimeStr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">课程时长：</span>
              <span class="detail-value">60 分钟</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">教练：</span>
              <span class="detail-value">Connie Yu（于苇凌）</span>
            </div>
          </div>

          <div class="note">
            <strong>📌 温馨提示：</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>请提前 5-10 分钟准备好安静的环境</li>
              <li>建议准备好笔记本记录要点</li>
              <li>如需取消或调整时间，请至少提前 24 小时告知</li>
            </ul>
          </div>

          <p>期待与您的交流！如有任何问题，欢迎随时联系。</p>
          
          <div class="footer">
            <p><strong>Connie Yu 职业教练</strong></p>
            <p>ICF 认证 ACC 级别教练</p>
            <p style="margin-top: 15px; font-size: 12px; color: #adb5bd;">
              此邮件由系统自动发送，请勿直接回复
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Booking confirmation sent to ${userEmail}`);
  } catch (error) {
    console.error(`[Email] Failed to send confirmation to ${userEmail}:`, error);
    throw new Error("Failed to send confirmation email");
  }
}

export interface BookingCancellationData {
  userEmail: string;
  userName: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Send booking cancellation email to user and coach
 */
export async function sendBookingCancellation(data: BookingCancellationData): Promise<void> {
  const { userEmail, userName, startTime, endTime } = data;

  // Format dates in China timezone
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    }).format(date);
  };

  const startTimeStr = formatDateTime(startTime);
  const endTimeStr = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
  }).format(endTime);

  const mailOptions = {
    from: `"Connie Yu 职业教练" <${env.GMAIL_USER}>`,
    to: userEmail,
    cc: "sw2703@icloud.com", // Also send to coach
    subject: "预约取消通知 - 职业教练课程",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f5576c;
          }
          .booking-details h2 {
            margin-top: 0;
            color: #f5576c;
            font-size: 18px;
          }
          .detail-row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #495057;
            display: inline-block;
            width: 80px;
          }
          .detail-value {
            color: #212529;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
          }
          .note {
            background: #d1ecf1;
            border: 1px solid #17a2b8;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❌ 预约已取消</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">您的职业教练课程预约已取消</p>
        </div>
        
        <div class="content">
          <p>亲爱的 <strong>${userName}</strong>，</p>
          <p>您的职业教练课程预约已成功取消，详情如下：</p>
          
          <div class="booking-details">
            <h2>📅 已取消的预约</h2>
            <div class="detail-row">
              <span class="detail-label">开始时间：</span>
              <span class="detail-value">${startTimeStr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">结束时间：</span>
              <span class="detail-value">${endTimeStr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">课程时长：</span>
              <span class="detail-value">60 分钟</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">教练：</span>
              <span class="detail-value">Connie Yu（于苇凌）</span>
            </div>
          </div>

          <div class="note">
            <strong>💡 温馨提示：</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>您的课时已退回账户</li>
              <li>如需重新预约，请访问预约页面选择新的时间</li>
              <li>如有任何问题，欢迎随时联系</li>
            </ul>
          </div>

          <p>期待下次与您的交流！</p>
          
          <div class="footer">
            <p><strong>Connie Yu 职业教练</strong></p>
            <p>ICF 认证 ACC 级别教练</p>
            <p style="margin-top: 15px; font-size: 12px; color: #adb5bd;">
              此邮件由系统自动发送，请勿直接回复
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Cancellation notification sent to ${userEmail} and coach`);
  } catch (error) {
    console.error(`[Email] Failed to send cancellation notification:`, error);
    throw new Error("Failed to send cancellation email");
  }
}
