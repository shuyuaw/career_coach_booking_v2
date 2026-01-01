export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            在事业的转折点，
            <br />
            找回闪闪发光的自己
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            告别职业焦虑与停滞。 从迷茧到精准行动，通过深度的启发式对话，
            <br className="hidden md:block" />
            陪你从“职业惯性”中突围，助你在事业转折点拿回主动权。
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            关于Connie
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  你好，我是Connie。在成为职业教练之前，我也曾经历过和你一样的时刻：站在职场的十字路口，虽然拥有令人羡慕的履历，却难以回答内心关于“意义”的追问。
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
                    src="/connie-profile.jpg"
                    alt="Connie Yu - 职业教练"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Connie Yu, PhD</h3>
                  <p className="text-lg text-slate-600 mt-2">于苇凌</p>
                  <p className="text-base text-slate-500 mt-1">ICF教练PCC认证中；LUXXprofile动机分析师认证中；中国心理卫生协会证书</p>
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                职业转型
              </h3>
              <p className="text-slate-600 leading-relaxed">
                结合LUXX驱动力深度分析，为您定制高效的转型路径，减少试错。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                找到热爱
              </h3>
              <p className="text-slate-600 leading-relaxed">
                结合LUXX驱动力测试，深入探索你的核心价值观与热爱，识别那些被忽视的"天赋闪光点"。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                持续成长
              </h3>
              <p className="text-slate-600 leading-relaxed">
                助力初级管理者完成从"执行"到"驱动"的心态转变，处理职场复杂人际与管理焦虑。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              适合人群
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12">
              如果你正处于这些场景，我的教练服务能帮助你
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">个人岗转管理</h3>
                    <p className="text-slate-600 leading-relaxed">
                      精通做事但管人就卡壳，渴望打破执行天花板、提升领导力的专业人才。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">全职妈妈重返职场</h3>
                    <p className="text-slate-600 leading-relaxed">
                      拒绝断档贬值，告别“重返”焦虑，将家庭管理经验迁移输出，助你重回职场高地并实现价值翻倍。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">寒冬赛道切换</h3>
                    <p className="text-slate-600 leading-relaxed">
                      身处下行行业，急需撕掉旧标签、将核心能力迁移至高价值赛道的突围者。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">斜杠/副业探索</h3>
                    <p className="text-slate-600 leading-relaxed">
                      不满于单一收入，试图挖掘第二曲线并实现商业化闭环的行动派。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              客户评价
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12">
              听听他们的故事
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Connie在教练过程中，展现了敏锐的洞察力，并且很擅长引导思考。每次的案例分析中，她都能快速觉察到我的症结，并通过提问引导思考，让我能清楚地找到自己真正需要解决的问题和应对策略。在她的帮助下，我进一步提高了工作中独立思考的能力和专业度，同时也获得了更多部门和合作伙伴的认可。谢谢Connie！
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-slate-900">Senior Operation Specialist</p>
                    <p className="text-sm text-slate-500">医药外企</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <svg className="w-8 h-8 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Connie教练以清晰严谨的逻辑思维引导我深入剖析问题本质，帮助我厘清内心的真实声音。在她的支持与指导下，我能够更坚定地做出符合初心的决策，实现自我认知的跃升。
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-slate-900">制剂总监</p>
                    <p className="text-sm text-slate-500">医药公司</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <svg className="w-8 h-8 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  在教练过程中，Connie教练持续深入地发问，带我层层剥离表象，精准洞察到我真正的核心需求和深层困惑。几次下来，我对她建立了深深的信任，也真正感受到教练对人生的正向影响。
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-slate-900">Scientist</p>
                    <p className="text-sm text-slate-500">互联网大厂</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <svg className="w-8 h-8 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  与Connie近三个月的陪伴和支持是我最棒的体验，她在情感上支持和肯定让我找到了久违的幸福感觉，在理智上的追问和引导又给我另一双眼睛另一个视角，我的世界再次打开了一扇大门，给我意料之外的收获和成长。
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-slate-900">Scientist</p>
                    <p className="text-sm text-slate-500">医药公司</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              联系方式
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              转型路上的每一次抉择，都值得更专业的陪伴。
              <br />
              欢迎添加我的微信，让我们一起穿透迷雾，找回内心的定力与前行的方向。
            </p>
            <div className="bg-white rounded-xl p-8 inline-block">
              <img
                src="/wechat-qr.jpg"
                alt="Connie微信二维码"
                className="w-64 h-64 object-contain rounded-lg"
              />
              <p className="text-slate-600 mt-4 text-sm">
                添加时请备注“职业教练咨询”
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
