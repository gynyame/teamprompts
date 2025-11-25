import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

export async function sendInvitationEmail({
    email,
    teamName,
    inviterName,
    token,
}: {
    email: string;
    teamName: string;
    inviterName: string;
    token: string;
}) {
    const inviteLink = `${APP_URL}/invite/${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'TeamPrompts <onboarding@resend.dev>', // Use default for now until domain is verified
            to: [email],
            subject: `Join ${teamName} on TeamPrompts`,
            html: `
        <div>
          <h1>You've been invited!</h1>
          <p><strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on TeamPrompts.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Accept Invitation</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Or copy and paste this URL into your browser: <br>
            ${inviteLink}
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { error };
        }

        return { data };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { error };
    }
}
