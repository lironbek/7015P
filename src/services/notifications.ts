import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { NotificationSettings } from '../types/settings';
import { Vehicle } from '../types/vehicle';

export class NotificationService {
    private settings: NotificationSettings;

    constructor(settings: NotificationSettings) {
        this.settings = settings;
        if (settings.sendgridApiKey) {
            sgMail.setApiKey(settings.sendgridApiKey);
        }
    }

    async sendEmailNotification(vehicle: Vehicle, daysUntil: number) {
        if (!this.settings.enableEmailNotifications || !this.settings.sendgridApiKey || !this.settings.email) {
            return;
        }

        const msg = {
            to: this.settings.email,
            from: 'no-reply@vehiclemanagement.com',
            subject: `תזכורת: טיפול רכב בעוד ${daysUntil} ימים`,
            text: `רכב מספר ${vehicle.vehicleNumber} מיועד לטיפול בתאריך ${new Date(vehicle.maintenanceDate!).toLocaleDateString('he-IL')}`,
            html: `
                <div dir="rtl">
                    <h2>תזכורת לטיפול רכב</h2>
                    <p>רכב מספר <strong>${vehicle.vehicleNumber}</strong> מיועד לטיפול בתאריך <strong>${new Date(vehicle.maintenanceDate!).toLocaleDateString('he-IL')}</strong></p>
                    <p>נותרו ${daysUntil} ימים עד לטיפול</p>
                </div>
            `
        };

        try {
            await sgMail.send(msg);
            console.log(`Email sent successfully to ${this.settings.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sendSMSNotification(vehicle: Vehicle, daysUntil: number) {
        if (
            !this.settings.enableSMSNotifications ||
            !this.settings.twilioAccountSid ||
            !this.settings.twilioAuthToken ||
            !this.settings.twilioFromNumber ||
            !this.settings.phone
        ) {
            return;
        }

        const client = twilio(this.settings.twilioAccountSid, this.settings.twilioAuthToken);
        const message = `תזכורת: רכב מספר ${vehicle.vehicleNumber} מיועד לטיפול בעוד ${daysUntil} ימים (${new Date(vehicle.maintenanceDate!).toLocaleDateString('he-IL')})`;

        try {
            await client.messages.create({
                body: message,
                from: this.settings.twilioFromNumber,
                to: this.settings.phone
            });
            console.log(`SMS sent successfully to ${this.settings.phone}`);
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    }

    async sendNotifications(vehicle: Vehicle, daysUntil: number) {
        await Promise.all([
            this.sendEmailNotification(vehicle, daysUntil),
            this.sendSMSNotification(vehicle, daysUntil)
        ]);
    }
} 