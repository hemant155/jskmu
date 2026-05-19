export async function POST(request) {
  try {
    const body = await request.json()
    const { amount, receipt } = body

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(key_id + ':' + key_secret).toString('base64'),
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: 'INR',
        receipt: receipt || 'jskmu_receipt',
      }),
    })

    const order = await response.json()

    if (!response.ok) {
      return Response.json({ success: false, error: order.error?.description || 'Order failed', debug: order }, { status: 500 })
    }

    return Response.json({ success: true, order })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}