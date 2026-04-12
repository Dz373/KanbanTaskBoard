import supabase from '../app/supabaseClient';

const inputElement = document.getElementById('input') as HTMLInputElement;
const buttonElement = document.getElementById('btn') as HTMLButtonElement;
const displayElement = document.getElementById('output') as HTMLParagraphElement;

// create guest session
let { data: { user }, error: authError } = await supabase.auth.getUser();
if (!user) {
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) {
        displayElement.textContent = `Auth Error: ${anonError.message}`;
    }
    user = anonData.user;
}

buttonElement.addEventListener('click', async () => {
    const value: string = inputElement.value;

    if (!value.trim()) {
        displayElement.textContent = `Nothing`;
        return;
    }

    const { data, error } = await supabase
        .from('test')
        .insert([{ 
            'title': value, 
            'status': 'todo',
            'user_id': user?.id
        }])
        .select();
});
