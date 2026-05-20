export async function sendBookingConfirmationEmail({ email, subject, message }) {
  const response = await fetch('http://localhost:5000/api/email/send', {
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
