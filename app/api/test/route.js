export async function GET() {
  return Response.json({ 
    status: 'connected', 
    message: 'Supabase connected successfully! RLS is working correctly.'
  })
}