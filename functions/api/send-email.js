export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, phone, message } = body;

    const apiKey = context.env.RESEND_API_KEY;

    const isValidEmail = (addr) => typeof addr === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.trim());

    const plainTextMessage = `
New Emergency Breakdown / Contact Inquiry

Name: ${name || 'N/A'}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}

Details:
${message || 'N/A'}
    `.trim();

    const payload = {
      from: 'Uncut Web Form <noreply@uncutelecmech.co.za>',
      to: ['service@uncutelecmech.co.za'],
      subject: `New Breakdown / Contact Inquiry from ${name || 'Website Visitor'}`,
      text: plainTextMessage,
      html: `
        <h3>New Emergency Breakdown / Contact Inquiry</h3>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <hr />
        <p><strong>Details:</strong></p>
        <p>${(message || '').replace(/\n/g, '<br/>')}</p>
      `,
    };

    if (isValidEmail(email)) {
      payload.reply_to = [email.trim()];
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const errorData = await resendResponse.json();
      return new Response(JSON.stringify({ success: false, error: errorData }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}