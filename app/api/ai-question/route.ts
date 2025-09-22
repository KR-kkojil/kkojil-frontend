import { type NextRequest, NextResponse } from "next/server"

const questionTemplates = {
  정치: [
    "현재 정치 상황에서 {topic}에 대한 시민들의 역할은 무엇일까요?",
    "{topic}이 민주주의에 미치는 영향을 어떻게 평가해야 할까요?",
    "정치적 {topic} 문제를 해결하기 위한 현실적인 방안은 무엇일까요?",
    "{topic}에 대한 정치인들의 입장 차이는 왜 발생할까요?",
    "젊은 세대가 {topic} 문제에 더 관심을 가져야 하는 이유는?",
    "{topic} 정책이 우리 사회에 가져올 장기적인 변화는 무엇일까요?",
    "국제 관계에서 {topic}의 중요성은 어떻게 설명될 수 있을까요?",
    "한국 정치의 고질적인 {topic} 문제를 해결할 근본적인 방법은 무엇일까요?",
    "한국 사회에서 {topic}에 대한 세대별 인식 차이는 왜 나타날까요?",
  ],
  개발: [
    "{topic} 기술이 개발자의 미래에 어떤 변화를 가져올까요?",
    "효율적인 {topic} 학습 방법은 무엇일까요?",
    "{topic}을 활용한 프로젝트에서 가장 중요한 고려사항은?",
    "초보 개발자가 {topic}을 배울 때 주의해야 할 점은?",
    "{topic} 분야에서 경력을 쌓기 위한 로드맵은 어떻게 될까요?",
    "대규모 트래픽을 처리하기 위한 {topic} 아키텍처 설계의 핵심은 무엇인가요?",
    "{topic}를 사용할 때 흔히 저지르는 실수는 무엇이며, 어떻게 피할 수 있나요?",
    "AI가 대체할 수 없는 개발자의 핵심 역량은 무엇이라고 생각하시나요?",
    "AI를 윤리적으로 활용하기 위해 개발자가 반드시 고려해야 할 점은 무엇일까요?",
  ],
  철학: [
    "{topic}에 대한 인간의 이해는 시대에 따라 어떻게 변해왔을까요?",
    "{topic}의 본질을 파악하기 위해 어떤 관점이 필요할까요?",
    "현대 사회에서 {topic}이 갖는 의미는 무엇일까요?",
    "{topic}에 대한 서로 다른 철학적 입장들을 어떻게 조화시킬 수 있을까요?",
    "개인의 {topic} 경험이 사회 전체에 미치는 영향은?",
    "기술 발전이 {topic}에 대한 우리의 관점을 어떻게 바꾸고 있나요?",
    "고대 철학자들이 {topic} 문제를 오늘날에 본다면 어떻게 생각할까요?",
    "만약 {topic}이(가) 가능하다면, 세상은 어떻게 바뀔까요?",
    "우리가 {topic}을(를) 당연하게 여기는 이유는 무엇일까요? 그 본질은 무엇일까요?",
    "{topic}의 개념 없이 인류 문명이 발전할 수 있었을까요?",
  ],
  일상: [
    "바쁜 현대인이 {topic}을 실천하기 위한 현실적인 방법은?",
    "{topic}이 개인의 행복과 성장에 미치는 영향은 무엇일까요?",
    "다른 사람들은 {topic}을 어떻게 관리하고 있을까요?",
    "{topic}에 대한 스트레스를 줄이는 효과적인 방법은?",
    "건강한 {topic} 습관을 만들기 위해 어떤 노력이 필요할까요?",
    "디지털 시대에 {topic}을 유지하는 것의 어려움은 무엇일까요?",
    "{topic}을 통해 얻을 수 있는 삶의 가장 큰 교훈은 무엇이라고 생각하세요?",
  ],
}

const topics = {
  정치: ["투표", "정책", "리더십", "시민참여", "정치개혁", "사회정의", "경제정책", "외교", "언론의 자유", "기후 변화 대응", "지역주의", "부동산 정책", "저출산 문제", "검찰 개혁"],
  개발: ["AI", "클라우드", "보안", "성능최적화", "코드리뷰", "팀워크", "새로운 프레임워크", "데이터베이스", "마이크로서비스", "DevOps 문화", "AGI의 등장", "AI의 창의성", "AI 면접관", "AI 저작권"],
  철학: ["존재", "의식", "자유의지", "도덕", "진리", "아름다움", "시간", "죽음", "인공지능의 윤리", "행복의 조건", "시간 여행", "투명인간", "생각 읽는 능력", "꿈 제어"],
  일상: ["시간관리", "인간관계", "건강", "취미", "스트레스", "목표설정", "소비", "휴식", "미니멀리즘", "정신 건강"],
}

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json()

    if (!category || !questionTemplates[category as keyof typeof questionTemplates]) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const templates = questionTemplates[category as keyof typeof questionTemplates]
    const categoryTopics = topics[category as keyof typeof topics]

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)]

    const question = randomTemplate.replace("{topic}", randomTopic)

    // 실제 AI 호출 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 200))

    return NextResponse.json({ question })
  } catch (error) {
    console.error("AI question generation error:", error)
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
