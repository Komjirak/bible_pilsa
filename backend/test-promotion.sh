#!/bin/bash

# 토스 프로모션 지급 API 테스트 스크립트

# 토스 개발자 센터에서 발급받은 보상 지급 API Key
# TOSS_PROMOTION_API_KEY가 설정되어 있지 않으면 오류 메시지 출력
if [ -z "$TOSS_PROMOTION_API_KEY" ]; then
  echo "에러: TOSS_PROMOTION_API_KEY 환경 변수가 설정되지 않았습니다."
  echo "사용법: TOSS_PROMOTION_API_KEY=\"발급받은키\" ./test-promotion.sh"
  exit 1
fi

PROMOTION_CODE="TEST_01KKBXJR87B4GAEVGGTK81Y3CA"
REWARD_KEY="test-reward-$(date +%s)"
USER_KEY="test-user-001"
AMOUNT=10

echo "▶ 토스 포인트 프로모션 지급 API 테스트 시작"
echo "  - 프로모션 코드: $PROMOTION_CODE"
echo "  - 보상 지급 키: $REWARD_KEY"
echo "  - 타겟 사용자 키: $USER_KEY"
echo "  - 지급액: $AMOUNT"
echo ""

curl -X POST https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion \
  --cert certs/toss-public.crt \
  --key certs/toss-private.key \
  -H "Authorization: Bearer $TOSS_PROMOTION_API_KEY" \
  -H "x-toss-user-key: $USER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "promotionCode": "'"$PROMOTION_CODE"'",
    "key": "'"$REWARD_KEY"'",
    "amount": '"$AMOUNT"'
  }' -v
echo ""
