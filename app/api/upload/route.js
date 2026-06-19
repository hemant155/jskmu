import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ALLOWED_BUCKETS = new Set(['missing-photos', 'body-photos'])
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request) {
  try {
    // Verify caller is authenticated
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7))
    if (authError || !user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const bucket = formData.get('bucket') || 'missing-photos'

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return Response.json({ success: false, error: 'Invalid bucket' }, { status: 400 })
    }
    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ success: false, error: 'File too large (max 5 MB)' }, { status: 400 })
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return Response.json({ success: false, error: 'File type not allowed (JPEG, PNG, WebP only)' }, { status: 400 })
    }

    // userId comes from the verified token, not the request body
    const userId = user.id
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

    return Response.json({ success: true, url: urlData.publicUrl })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
