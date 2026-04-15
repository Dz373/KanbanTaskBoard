import supabase from '../scripts/supabaseClient';

const table = "test";

export const getCurrentUser = async () => {
  let { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const { data } = await supabase.auth.signInAnonymously();
    user = data?.user;
  }

  return user;
};

export const fetchTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const createTask = async (title: string, status: string, userId: string) => {
  const { data, error } = await supabase
    .from(table)
    .insert([{ title, status, user_id: userId }])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateTaskStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};