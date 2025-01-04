import { supabase } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { NotificationSettings } from '../types/settings';

export class NotificationService {
    constructor(private settings: NotificationSettings) {}

    async sendNotifications(vehicle: Vehicle, daysUntil: number) {
        const message = this.createNotificationMessage(vehicle, daysUntil);

        if (this.settings.enableEmailNotifications) {
            await this.sendEmailNotification(message);
        }

        if (this.settings.enableSMSNotifications) {
            await this.sendSMSNotification(message);
        }
    }

    private createNotificationMessage(vehicle: Vehicle, daysUntil: number): string {
        return `תזכורת: טיפול רכב מספר ${vehicle.vehicleNumber} מתוכנן בעוד ${daysUntil} ימים (${vehicle.maintenanceDate})`;
    }

    private async sendEmailNotification(message: string) {
        try {
            const { error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: this.settings.email,
                    subject: 'תזכורת טיפול רכב',
                    message
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending email notification:', error);
            throw error;
        }
    }

    private async sendSMSNotification(message: string) {
        try {
            const { error } = await supabase.functions.invoke('send-sms', {
                body: {
                    to: this.settings.phone,
                    message
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending SMS notification:', error);
            throw error;
        }
    }
} 