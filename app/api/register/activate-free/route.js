import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Service-role client — bypasses RLS for trusted server writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// 2-week launch promo: family registration is free, no Razorpay payment.
// Grants the same dashboard/database access a paid account gets, but for
// 30 days only (free trial, not a free year) so payment becomes required afterward.
export async function POST(request) {
  try {
    // Derive user from the Bearer token — never trust client-supplied user_id
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7))
    if (authError || !user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Only family accounts get free activation. Read role from auth metadata
    // (set at signUp, available immediately) rather than the profiles table —
    // the DB trigger that creates the profile row can still be in flight here.
    if (user.user_metadata?.role !== 'family') {
      return Response.json({ success: false, error: 'Not a family account' }, { status: 403 })
    }

    const accessExpiry = new Date()
    accessExpiry.setDate(accessExpiry.getDate() + 30)

    await supabaseAdmin
      .from('profiles')
      .update({
        payment_done: true,
        access_expires_at: accessExpiry.toISOString()
      })
      .eq('id', user.id)

    return Response.json({ success: true })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
