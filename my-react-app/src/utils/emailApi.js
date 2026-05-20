export async function sendBookingConfirmationEmail({ email, subject, message }) {
  const response = await fetch('https://holiday-planner-gray.vercel.app/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, subject, message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to send email');
  }

  return response.json();
}
