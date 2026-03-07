#!/usr/bin/env node
/**
 * SVG → PNG 변환 스크립트
 * 사용법: node convert-to-png.js
 * 의존성: sharp (FE node_modules에서 참조)
 *
 * sharp 경로 우선순위:
 * 1. ../frontend/node_modules/sharp
 * 2. 로컬 node_modules/sharp (별도 설치 시)
 * 3. 전역 npm에서 require
 */

const path = require('path');
const fs = require('fs');

// Sharp 로드 시도
let sharp;
const sharpPaths = [
  path.join(__dirname, '../frontend/node_modules/sharp'),
  path.join(__dirname, 'node_modules/sharp'),
];

for (const p of sharpPaths) {
  try {
    if (fs.existsSync(p)) {
      sharp = require(p);
      console.log(`✅ sharp 로드 성공: ${p}`);
      break;
    }
  } catch {
    // continue
  }
}

if (!sharp) {
  try {
    sharp = require('sharp');
    console.log('✅ sharp 로드 성공: 전역');
  } catch {
    console.error('❌ sharp 모듈을 찾을 수 없습니다.');
    console.error('   해결 방법: cd ../frontend && npm install');
    console.error('   또는: npm install sharp');
    process.exit(1);
  }
}

const SVG_DIR = path.join(__dirname, 'svg');
const PNG_DIR = path.join(__dirname, 'png');

if (!fs.existsSync(PNG_DIR)) {
  fs.mkdirSync(PNG_DIR, { recursive: true });
}

// SVG 파일 목록과 출력 크기 정의
const assets = [
  { name: 'logo-600x600',         width: 600,  height: 600  },
  { name: 'logo-1000x1000',       width: 1000, height: 1000 },
  { name: 'banner-1932x828',      width: 1932, height: 828  },
  { name: 'og-image-1200x630',    width: 1200, height: 630  },
  { name: 'screenshot-01-home',   width: 636,  height: 1048 },
  { name: 'screenshot-02-writing',width: 636,  height: 1048 },
  { name: 'screenshot-03-completion', width: 636, height: 1048 },
  { name: 'favicon-32x32',        width: 32,   height: 32   },
];

async function convertAll() {
  let success = 0;
  let failed = 0;

  for (const asset of assets) {
    const svgPath = path.join(SVG_DIR, `${asset.name}.svg`);
    const pngPath = path.join(PNG_DIR, `${asset.name}.png`);

    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  SVG 없음: ${asset.name}.svg — 스킵`);
      failed++;
      continue;
    }

    try {
      await sharp(svgPath)
        .resize(asset.width, asset.height)
        .png({ quality: 95 })
        .toFile(pngPath);

      const stat = fs.statSync(pngPath);
      const kb = (stat.size / 1024).toFixed(1);
      console.log(`✅ ${asset.name}.png (${asset.width}×${asset.height}, ${kb}KB)`);
      success++;
    } catch (err) {
      console.error(`❌ 변환 실패: ${asset.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n변환 완료: ${success}개 성공, ${failed}개 실패`);
  if (failed > 0) process.exit(1);
}

convertAll().catch((err) => {
  console.error('변환 중 오류:', err);
  process.exit(1);
});
