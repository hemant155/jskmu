import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id
    } = body

    // Signature verify karo
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    if (expectedSign !== razorpay_signature) {
      return Response.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Payment record save karo
    await supabase.from('payments').insert({
      user_id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: 499,
      status: 'success'
    })

    // Profile update karo — payment done + access 1 year
    const accessExpiry = new Date()
    accessExpiry.setFullYear(accessExpiry.getFullYear() + 1)

    await supabase
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