export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            在职场的转折点，
            <br />
            遇见更清晰的自己
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            专注于跨行转岗与职业兴趣发掘。通过深度的启发式对话，
            <br className="hidden md:block" />
            陪你从"职业惯性"中突围，找回工作的自驱力。
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            关于康妮
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  你好，我是康妮。在成为职业教练之前，我也曾经历过和你一样的时刻：站在职场的十字路口，虽然拥有令人羡慕的履历，却难以回答内心关于"意义"的追问。
                </p>
                <p>
                  我相信职业不应该是一场消耗，而应该是自我实现的载体。我的角色不是给你标准答案，而是通过启发式的陪伴，帮你拨开迷雾，把你沉淀多年的经验转化为转岗新赛道的动力。
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/coach-profile.jpg"
                    alt="Connie Yu - 职业教练"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Connie Yu</h3>
                  <p className="text-lg text-slate-600 mt-2">于苇凌</p>
                  <p className="text-base text-slate-500 mt-1">ICF 认证 ACC 级别教练</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Coaching Section */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
              什么是职业教练
            </h2>
            <p className="text-2xl text-slate-700 font-medium mb-8 text-center">
              职业教练，是你职场路上的"副驾驶"
            </p>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                很多人会把职业教练误认为猎头、导师或咨询顾问。
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3">•</span>
                  <span>猎头关心的是职位的匹配；</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3">•</span>
                  <span>导师关心的是经验的传授；</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3">•</span>
                  <span>而职业教练关心的，是你。</span>
                </li>
              </ul>
              <p>
                职业教练并不直接给你一套"标准答案"，因为最适合你的答案其实就在你心中。我的工作是通过系统性的提问、深度的倾听和专业的工具，帮助你：
              </p>
              <ul className="space-y-4 ml-6">
                <li className="flex items-start">
                  <span className="font-semibold text-slate-900 mr-3">打破认知盲区：</span>
                  <span>看到那些你习以为常、却极具价值的能力。</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-slate-900 mr-3">理清思维乱麻：</span>
                  <span>在复杂的利益得失中，找回最核心的职业优先级。</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-slate-900 mr-3">激发内在能量：</span>
                  <span>从"我必须做"转变为"我想要做"。</span>
                </li>
              </ul>
              <p className="pt-4">
                如果说职场是一场马拉松，你依然是那个奔跑的人，而我是那个为你提供坐标、陪你调整呼吸、并确保你正跑向内心终点的人。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            核心服务
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                职业兴趣深度发掘
              </h3>
              <p className="text-slate-600 leading-relaxed">
                不只是做测试，而是深入探索你的核心价值观与热爱，识别那些被忽视的"天赋闪光点"。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                跨行转岗战略咨询
              </h3>
              <p className="text-slate-600 leading-relaxed">
                针对资深人士的"高昂转型成本"，设计稳健的转岗路径，实现专业能力的迁移与溢价。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                管理心智成长
              </h3>
              <p className="text-slate-600 leading-relaxed">
                助力初级管理者完成从"执行"到"驱动"的心态转变，处理职场复杂人际与管理焦虑。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              联系方式
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              职业转型是一段孤独的旅程，你不必独自前行。
              <br />
              如果你正面临选择的困惑，欢迎扫码加我微信，聊聊你的现状。
            </p>
            <div className="bg-white rounded-xl p-8 inline-block">
              <div className="w-64 h-64 bg-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-500 text-center px-4">
                  微信二维码
                  <br />
                  <span className="text-sm">(请提供二维码图片)</span>
                </p>
              </div>
              <p className="text-slate-600 mt-4 text-sm">
                添加时请备注"职业教练咨询"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Connie Yu 职业教练. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
