import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { pushTime, fontSize, setPushTime, setFontSize } = useSettingsStore();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: '#F4F5F7',
    }}>
      {/* 헤더 */}
      <div style={{
        textAlign: 'center', padding: '12px 16px',
        backgroundColor: '#fff', borderBottom: '1px solid #F2F4F6',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', margin: 0 }}>설정</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 20px' }}>
        {/* 알림 설정 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>
            알림 설정
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#333D4B' }}>푸시 알림 시간</span>
            <input
              type="time"
              value={pushTime}
              onChange={(e) => {
                const newTime = e.target.value;
                setPushTime(newTime);
                if (newTime) {
                  alert(`매일 ${newTime}에 푸시 알림이 발송되도록 설정되었습니다.`);
                }
              }}
              style={{
                padding: '8px 12px', border: '1px solid #E5E8EB',
                borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit',
                color: '#191F28', backgroundColor: '#F8F9FA',
              }}
            />
          </div>
        </div>

        {/* 보기 설정 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>
            보기 설정
          </h3>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#333D4B', display: 'block', marginBottom: '12px' }}>
            텍스트 폰트 크기
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['small', 'medium', 'large'] as const).map((size) => {
              const isActive = fontSize === size;
              const label = size === 'small' ? '작게' : size === 'medium' ? '중간' : '크게';
              const previewSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';
              return (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: '12px',
                    border: isActive ? '2px solid #3182F6' : '1px solid #E5E8EB',
                    backgroundColor: isActive ? '#EBF3FE' : '#fff',
                    color: isActive ? '#3182F6' : '#8B95A1',
                    fontWeight: 600, fontSize: previewSize, cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 앱 정보 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>
            앱 정보
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#8B95A1' }}>버전</span>
            <span style={{ fontSize: '14px', color: '#191F28', fontWeight: 500 }}>1.0.0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#8B95A1' }}>성경 번역</span>
            <span style={{ fontSize: '14px', color: '#191F28', fontWeight: 500 }}>개역한글판 (1961)</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 20px' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%', height: '52px', borderRadius: '14px',
            backgroundColor: '#fff', color: '#4E5968',
            fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
