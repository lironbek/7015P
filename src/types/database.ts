export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          role: string
          platoonId: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          firstName: string
          lastName: string
          role: string
          platoonId?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          role?: string
          platoonId?: string | null
          created_at?: string
        }
      }
      platoons: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          vehicleNumber: string
          vehicleTypeId: string
          platoonId: string
          status: string
          classification: string
          hasFireExtinguisher: boolean
          hasDriverTools: boolean
          maintenanceDate: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicleNumber: string
          vehicleTypeId: string
          platoonId: string
          status: string
          classification: string
          hasFireExtinguisher?: boolean
          hasDriverTools?: boolean
          maintenanceDate?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicleNumber?: string
          vehicleTypeId?: string
          platoonId?: string
          status?: string
          classification?: string
          hasFireExtinguisher?: boolean
          hasDriverTools?: boolean
          maintenanceDate?: string | null
          created_at?: string
        }
      }
      vehicle_types: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      maintenance_logs: {
        Row: {
          id: string
          vehicleId: string
          userId: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          vehicleId: string
          userId: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          vehicleId?: string
          userId?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
    }
  }
} 