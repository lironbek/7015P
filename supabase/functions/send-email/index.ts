import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { to, subject, message } = await req.json();

        // Initialize SMTP client
        const client = new SmtpClient();
        await client.connectTLS({
            hostname: Deno.env.get('SMTP_HOSTNAME') || '',
            port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
            username: Deno.env.get('SMTP_USERNAME') || '',
            password: Deno.env.get('SMTP_PASSWORD') || '',
        });

        // Send email
        await client.send({
            from: Deno.env.get('SMTP_FROM') || '',
            to: to,
            subject: subject,
            content: message,
            html: `<div dir="rtl">${message}</div>`,
        });

        await client.close();

        return new Response(
            JSON.stringify({ message: 'Email sent successfully' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
}); 