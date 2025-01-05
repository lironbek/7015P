interface RequestBody {
    to: string;
    subject: string;
    message: string;
}

interface ResponseData {
    message: string;
    error?: string;
}

export default async function handler(
    req: { method: string; body: RequestBody },
    res: { 
        setHeader: (name: string, value: string) => void;
        status: (code: number) => { json: (data: ResponseData) => void };
    }
) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
        res.status(200).json({ message: 'ok' });
        return;
    }

    try {
        const { to, subject, message } = req.body;

        // Send email using Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: process.env.EMAIL_FROM,
                to: to,
                subject: subject,
                text: message,
                html: `<div dir="rtl">${message}</div>`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error', error: error.message });
        } else {
            res.status(400).json({ message: 'Error', error: 'An unknown error occurred' });
        }
    }
} 