export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, phone, message } = body;

    const apiKey = context.env.RESEND_API_KEY;

    const isValidEmail = (addr) => typeof addr === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.trim());

    const senderName = name ? name.trim() : 'Website Visitor';
    const plainTextMessage = `
Website Contact Inquiry

Name: ${senderName}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}

Message:
${message || 'N/A'}
    `.trim();

    const payload = {
      from: 'Uncut Web Form <onboarding@resend.dev>',
      to: ['marlan_p@yahoo.com'],
      subject: `Website Inquiry: ${senderName}`,
      text: plainTextMessage,
      html: `
        <h2>Website Contact Inquiry</h2>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
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