export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, phone, message } = body;

    const apiKey = context.env.BREVO_API_KEY;

    const isValidEmail = (addr) => typeof addr === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.trim());
    const senderName = name ? name.trim() : 'Website Visitor';

    const payload = {
      sender: { name: 'Uncut Web Form', email: 'service@uncutelecmech.co.za' },
      to: [{ email: 'service@uncutelecmech.co.za' }],
      subject: `Website Inquiry: ${senderName}`,
      textContent: `Website Inquiry\nName: ${senderName}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message || 'N/A'}`,
      htmlContent: `
        <h3>Website Inquiry</h3>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${(message || '').replace(/\n/g, '<br/>')}</p>
      `,
    };

    if (isValidEmail(email)) {
      payload.replyTo = { email: email.trim() };
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const brevoData = await brevoResponse.json();

    if (brevoResponse.ok) {
      return new Response(JSON.stringify({ success: true, data: brevoData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: brevoData }), {
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