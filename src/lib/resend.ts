import 'server-only'
import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'noreply@indianheartsusa.com'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'IndianHearts USA'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendApprovalEmail(to: string, firstName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `Welcome to ${APP_NAME} — Your profile is approved!`,
    html: `<h2>Dear ${firstName},</h2><p>Your profile on <strong>${APP_NAME}</strong> has been approved. You can now log in and start your journey.</p>`,
  })
}

export async function sendRejectionEmail(to: string, firstName: string, reason: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `${APP_NAME} — Profile Update Required`,
    html: `<h2>Dear ${firstName},</h2><p>We were unable to approve your profile. Reason: <strong>${reason}</strong>. Please contact support.</p>`,
  })
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `Welcome to ${APP_NAME} — Registration Received`,
    html: `<h2>Dear ${firstName},</h2><p>Thank you for registering with <strong>${APP_NAME}</strong>. Your profile is under review and you will receive a notification once approved (usually within 24 hours).</p>`,
  })
}

export async function sendInterestEmail(to: string, fromName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `${fromName} has expressed interest in your profile`,
    html: `<p><strong>${fromName}</strong> has sent you an interest on <strong>${APP_NAME}</strong>. Log in to view and respond.</p>`,
  })
}

export async function sendMessageEmail(to: string, fromName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `New message from ${fromName} on ${APP_NAME}`,
    html: `<p>You have a new message from <strong>${fromName}</strong>. Log in to read and reply.</p>`,
  })
}

export async function sendSubscriptionEmail(to: string, firstName: string, tier: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `${APP_NAME} — ${tier} membership activated`,
    html: `<h2>Dear ${firstName},</h2><p>Your <strong>${tier}</strong> membership on ${APP_NAME} is now active. Enjoy premium features!</p>`,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `${APP_NAME} — Reset Your Password`,
    html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">Reset Password</a></p>`,
  })
}

export async function sendProfileViewedEmail(to: string, viewerName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `${viewerName} viewed your profile on ${APP_NAME}`,
    html: `<p><strong>${viewerName}</strong> viewed your profile on <strong>${APP_NAME}</strong>. Log in to view and connect!</p>`,
  })
}

export async function sendMutualFavoriteEmail(to: string, favoriterName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `🎉 Mutual Interest! ${favoriterName} saved your profile`,
    html: `<p><strong>${favoriterName}</strong> has saved your profile as a favorite on <strong>${APP_NAME}</strong>! Check out their profile and see if it's a match.</p>`,
  })
}

export async function sendInterestAcceptedEmail(to: string, acceptorName: string) {
  return getResend().emails.send({
    from: FROM, to,
    subject: `Great news! ${acceptorName} accepted your interest`,
    html: `<p><strong>${acceptorName}</strong> accepted your interest on <strong>${APP_NAME}</strong>! You can now message them to start a conversation.</p>`,
  })
}
