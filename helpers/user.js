export async function uploadUserProfileImage(
  supabase,
  userId,
  file,
  bucket,
  profileColumn,
) {
  return new Promise(async (resolve, reject) => {
    const newName = Date.now() + file.name;
    const {data,error} = await supabase.storage
      .from(bucket)
      .upload(newName, file);


    if (error) throw error;
    if (data) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL + `/storage/v1/object/public/${bucket}/` + data.path;
      supabase.from('profiles')
        .update({
          [profileColumn]: url,
        })
        .eq('id', userId)
        .then(result => {
          if (!result.error) {
            resolve();
          } else {
            throw result.error;
          }
        });
    }
  });
}

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://yourproject.supabase.co'
// const supabaseKey = 'your-anon-key'

// const supabase = createClient(supabaseUrl, supabaseKey)

// async function getFriendsInCommon() {
//   const { data, error } = await supabase
//     .from('User')
//     .select('u1.id, u2.id')
//     .join('Friendship as f1', 'u1.id', 'f1.user1_id')
//     .or('u1.id', 'eq', 'f1.user2_id')
//     .join('Friendship as f2', join => {
//       join.or('f1.user1_id', 'eq', 'f2.user1_id')
//       join.or('f1.user1_id', 'eq', 'f2.user2_id')
//       join.or('f1.user2_id', 'eq', 'f2.user1_id')
//       join.or('f1.user2_id', 'eq', 'f2.user2_id')
//     })
//     .join('User as u2', 'u2.id', 'f2.user1_id')
//     .or('u2.id', 'eq', 'f2.user2_id')
//     .lt('u1.id', 'u2.id')
//     .group('u1.id, u2.id')
//     .having('COUNT(*)', 'gt', 0)

//   if (error) console.log('Error fetching friends in common:', error.message)
//   else console.log('Friends in common:', data)
// }d1b50838-8535-4c2a-85ef-9b2da0fda866

// getFriendsInCommon()
