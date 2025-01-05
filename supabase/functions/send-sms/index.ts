interface RequestBody {
    to: string;
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
        const { to, message } = req.body;

        // Send SMS using Twilio API
        const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Messages.json', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                To: to,
                From: process.env.TWILIO_PHONE_NUMBER || '',
                Body: message
            }).toString()
        });

        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }

        res.status(200).json({ message: 'SMS sent successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error', error: error.message });
        } else {
            res.status(400).json({ message: 'Error', error: 'An unknown error occurred' });
        }
    }
} 