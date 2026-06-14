import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Service-role client — bypasses RLS for trusted server writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    // Derive user_id from the Bearer token — never trust client-supplied user_id
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7))
    if (authError || !user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const user_id = user.id

    // Verify Razorpay signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    if (expectedSign !== razorpay_signature) {
      return Response.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Save payment record (service role — RLS-safe)
    await supabaseAdmin.from('payments').insert({
      user_id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: 499,
      status: 'success'
    })

    // Mark profile as paid, set 1-year access expiry (service role — RLS-safe)
    const accessExpiry = new Date()
    accessExpiry.setFullYear(accessExpiry.getFullYear() + 1)

    await supabaseAdmin
      .from('profiles')
      .update({
        payment_done: true,
        access_expires_at: accessExpiry.toISOString()
      })
      .eq('id', user_id)

    return Response.json({ success: true })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
