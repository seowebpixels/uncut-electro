export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, phone, message } = body;

    const apiKey = context.env.RESEND_API_KEY;

    const isValidEmail = (addr) => typeof addr === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.trim());

    const senderName = name ? name.trim() : 'Website Visitor';

    const payload = {
      from: 'Uncut Web Form <form@uncutelecmech.co.za>',
      to: ['service@uncutelecmech.co.za'],
      subject: `Website Inquiry: ${senderName}`,
      text: `Website Inquiry\nName: ${senderName}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message || 'N/A'}`,
      html: `
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

    const resendData = await resendResponse.json();

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true, data: resendData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: resendData }), {
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