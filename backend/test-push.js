const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

async function main() {
  const targetTime = dayjs().tz('Asia/Seoul').add(1, 'minute').format('HH:mm');
  console.log('Setting notification time to', targetTime);
  
  await prisma.user.updateMany({
    data: {
      notificationEnabled: true,
      notificationTime: targetTime,
    }
  });
  console.log('Update complete. Wait 1 minute for the cron job to fire.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
