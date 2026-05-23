import 'server-only'
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const FROM = process.env.TWILIO_WHATSAPP_FROM!
const ADMIN = process.env.ADMIN_WHATSAPP!
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'IndianHearts USA'

async function sendWhatsApp(to: string, body: string) {
  try {
    return await client.messages.create({ from: FROM, to, body })
  } catch (err) {
    console.error('WhatsApp send failed', err)
  }
}

export async function notifyAdminNewRegistration(name: string, email: string) {
  return sendWhatsApp(ADMIN, `🔔 ${APP_NAME}: New registration from ${name} (${email}). Review at /admin/members`)
}

export async function notifyAdminPayment(name: string, tier: string, amount: string) {
  return sendWhatsApp(ADMIN, `💰 ${APP_NAME}: ${name} upgraded to ${tier} (${amount}).`)
}

export async function notifyMemberApproved(whatsapp: string, name: string) {
  return sendWhatsApp(`whatsapp:${whatsapp}`, `✅ ${APP_NAME}: Hi ${name}! Your profile is approved. Login at ${process.env.NEXT_PUBLIC_APP_URL}/login`)
}

export async function notifyNewInterest(whatsapp: string, fromName: string) {
  return sendWhatsApp(`whatsapp:${whatsapp}`, `💌 ${APP_NAME}: ${fromName} is interested in your profile! Login to respond.`)
}

export async function notifyNewMessage(whatsapp: string, fromName: string) {
  return sendWhatsApp(`whatsapp:${whatsapp}`, `💬 ${APP_NAME}: You have a new message from ${fromName}. Login to reply.`)
}

export async function sendWhatsAppIntroRelay(toNumber: string, fromName: string, introMessage: string) {
  return sendWhatsApp(
    `whatsapp:${toNumber}`,
    `💐 ${APP_NAME} Introduction:\n${fromName} would like to connect: "${introMessage}"\nReply on ${APP_NAME} to respond.`
  )
}
