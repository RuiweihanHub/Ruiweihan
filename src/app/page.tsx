'use client'

import { useState, useEffect } from 'react'

// 快捷操作
const quickActions = [
  { icon: '✍️', title: '写一篇随笔', desc: '记录今日想法' },
  { icon: '💡', title: '灵感笔记', desc: '捕捉创意火花' },
  { icon: '📖', title: '读书心得', desc: '分享阅读感悟' },
  { icon: '🎯', title: '年度目标', desc: '规划未来方向' }
]

interface User {
  id: string
  username: string
}

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 检查登录状态
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  // 登录/注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          username,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '操作失败')
      } else {
        setUser(data.user)
        setShowModal(false)
        setUsername('')
        setPassword('')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 退出登录
  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 顶部公告栏 */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-2.5 flex items-center justify-center">
          <a href="#" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <span>🚀</span>
            <span>Wei语言公布最新Aurora版本，提升性能超300倍！</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* 右上角登录/用户区域 */}
      <div className="fixed top-3 right-6 z-50">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">你好，{user.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              退出
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            登录
          </button>
        )}
      </div>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* 标题区 */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-medium mb-3 tracking-tight text-gray-900">
            Rui
          </h1>
          <p className="text-gray-400 text-base">
            写作 · 思考 · 生活
          </p>
        </div>

        {/* 输入框 */}
        <div className="w-full max-w-2xl mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-gray-300 focus-within:bg-white transition-all duration-300 shadow-sm">
              <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLine-linejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="开始写作，或搜索..."
                className="flex-1 bg-transparent px-4 py-4 text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              <button className="mr-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                发送
              </button>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.title}</span>
                <span className="text-xs text-gray-400 mt-0.5">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 底部链接 */}
      <footer className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>© 2024 Rui</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-600 transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 登录/注册弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* 弹窗头部 */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isLogin ? '登录' : '注册'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
              </button>

              <div className="text-center text-sm text-gray-500">
                {isLogin ? '还没有账号？' : '已有账号？'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className="text-gray-900 font-medium hover:underline ml-1"
                >
                  {isLogin ? '立即注册' : '立即登录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
