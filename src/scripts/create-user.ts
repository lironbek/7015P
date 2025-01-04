import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjuimyhhhqojbzdayvnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdWlteWhoaHFvamJ6ZGF5dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDgwMDgsImV4cCI6MjA1MTU4NDAwOH0.nGCEH_B3YZKZ_EgScFmBxp0UCymYbMnRpOo97v7pCnU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'lironbek88@gmail.com',
    password: '123456',
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully:', data);
}

createUser(); 