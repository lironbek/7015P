export interface NotificationSettings {
    email: string;
    phone: string;
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
}

export interface Settings {
    systemTitle: string;
    themeColor: string;
    logo?: string;
    notifications: NotificationSettings;
} 