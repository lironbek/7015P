import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjuimyhhhqojbzdayvnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdWlteWhoaHFvamJ6ZGF5dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDgwMDgsImV4cCI6MjA1MTU4NDAwOH0.nGCEH_B3YZKZ_EgScFmBxp0UCymYbMnRpOo97v7pCnU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const updateUserRole = async (email: string, role: 'admin' | 'user') => {
    try {
        // קודם נמצא את המשתמש לפי האימייל
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError) {
            console.error('Error finding user:', userError);
            return { error: userError };
        }

        if (!userData) {
            // אם המשתמש לא נמצא, ניצור אותו
            const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
                email,
                password: Math.random().toString(36).slice(-8), // סיסמה רנדומלית
                options: {
                    data: {
                        role: role
                    }
                }
            });
            
            if (authError) {
                console.error('Error creating auth user:', authError);
                return { error: authError };
            }

            if (authUser) {
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: authUser.id,
                            email: email,
                            role: role,
                            first_name: '',
                            last_name: ''
                        }
                    ]);

                if (insertError) {
                    console.error('Error creating user:', insertError);
                    return { error: insertError };
                }
            }
        } else {
            // אם המשתמש נמצא, נעדכן את התפקיד שלו
            const { error: updateError } = await supabase
                .from('users')
                .update({ role: role })
                .eq('id', userData.id);

            if (updateError) {
                console.error('Error updating user role:', updateError);
                return { error: updateError };
            }
        }

        return { success: true };
    } catch (err) {
        console.error('Error:', err);
        return { error: err };
    }
}; 