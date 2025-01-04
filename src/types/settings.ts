export interface NotificationSettings {
    email: string;
    phone: string;
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    notifyDaysBefore: number[];
    sendgridApiKey?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioFromNumber?: string;
}

export interface Settings {
    systemTitle: string;
    themeColor: string;
    logo?: string;
    notifications: NotificationSettings;
} 