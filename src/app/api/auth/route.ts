import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// 简单的密码哈希
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// 初始化默认用户
async function initDefaultUser() {
  try {
    const existing = await db.user.findUnique({ where: { username: 'administrator' } })
    if (!existing) {
      await db.user.create({
        data: {
          username: 'administrator',
          password: simpleHash('12345678')
        }
      })
    }
  } catch {
    // 忽略错误
  }
}

// GET - 检查登录状态
export async function GET() {
  try {
    await initDefaultUser()
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json({ user: null })
    }
    
    const user = await db.user.findUnique({ 
      where: { id: userId },
      select: { id: true, username: true }
    })
    
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}

// POST - 登录/注册
export async function POST(request: NextRequest) {
  try {
    await initDefaultUser()
    const body = await request.json()
    const { action, username, password } = body
    
    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 })
    }
    
    if (username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: '用户名长度应为2-20个字符' }, { status: 400 })
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: '密码长度至少6个字符' }, { status: 400 })
    }
    
    const hashedPassword = simpleHash(password)
    
    if (action === 'register') {
      const existing = await db.user.findUnique({ where: { username } })
      if (existing) {
        return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
      }
      
      const user = await db.user.create({
        data: { username, password: hashedPassword },
        select: { id: true, username: true }
      })
      
      const response = NextResponse.json({ user })
      response.cookies.set('userId', user.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      
      return response
    } else {
      const user = await db.user.findUnique({ where: { username } })
      if (!user || user.password !== hashedPassword) {
        return NextResponse.json({ error: '用户名或密码错误' }, { status: 400 })
      }
      
      const response = NextResponse.json({ user: { id: user.id, username: user.username } })
      response.cookies.set('userId', user.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      
      return response
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// DELETE - 退出登录
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('userId')
    return response
  } catch {
    return NextResponse.json({ success: true })
  }
}
