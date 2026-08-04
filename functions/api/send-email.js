export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, phone, message } = body;

    const apiKey = context.env.RESEND_API_KEY || 're_YOUR_RESEND_API_KEY';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Uncut Web Form <noreply@uncutelecmech.co.za>',
        to: ['service@uncutelecmech.co.za'],
        reply_to: email,
        subject: `New Breakdown / Contact Inquiry from ${name}`,
        html: `
          <h3>New Emergency Breakdown / Contact Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr />
          <p><strong>Details:</strong></p>
          <p>${(message || '').replace(/\n/g, '<br/>')}</p>
        `,
      }),
    });

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const errorData = await resendResponse.json();
      return new Response(JSON.stringify({ success: false, error: errorData.message }), {
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