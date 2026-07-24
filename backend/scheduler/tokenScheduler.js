const cron = require('node-cron');
const pool = require('../utils/db');

function generateTokenCode() {
  // 6 ডিজিটের আলফানিউমেরিক টোকেন
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 📅 ডেট ফরম্যাট করার হেল্পার ফাংশন
function getLocalDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function generateTokensForTomorrow() {
  // আগামীকালের তারিখ সঠিকভাবে বের করুন
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = getLocalDateStr(tomorrow);

  console.log(`[Token Scheduler] 🔄 Generating tokens for ${dateStr}...`);

  try {
    // Check if there are any meals for tomorrow
    const [meals] = await pool.query(
      `SELECT id, user_id, date, breakfast, lunch, dinner 
       FROM meals 
       WHERE date = ?`,
      [dateStr]
    );

    console.log(`[Token Scheduler] 📊 Found ${meals.length} meals for ${dateStr}`);

    if (meals.length === 0) {
      console.log(`[Token Scheduler] ⚠️ No meals found for ${dateStr}`);
      return { count: 0, date: dateStr };
    }

    let tokensCreated = 0;
    let totalMeals = 0;

    for (const meal of meals) {
      const mealTypes = [];
      if (meal.breakfast) mealTypes.push('breakfast');
      if (meal.lunch) mealTypes.push('lunch');
      if (meal.dinner) mealTypes.push('dinner');

      totalMeals += mealTypes.length;

      for (const mealType of mealTypes) {
        // Check if token already exists
        const [existing] = await pool.query(
          `SELECT id FROM tokens 
           WHERE user_id = ? AND meal_date = ? AND meal_type = ?`,
          [meal.user_id, dateStr, mealType]
        );

        if (existing.length === 0) {
          // Generate unique token
          let token = generateTokenCode();
          let isUnique = false;
          let attempts = 0;
          
          while (!isUnique && attempts < 5) {
            const [check] = await pool.query(
              `SELECT id FROM tokens WHERE token = ?`,
              [token]
            );
            if (check.length === 0) {
              isUnique = true;
            } else {
              token = generateTokenCode();
              attempts++;
            }
          }

          if (!isUnique) {
            console.log(`[Token Scheduler] ⚠️ Failed to generate unique token for user ${meal.user_id}, ${mealType}`);
            continue;
          }

          // Insert token
          await pool.query(
            `INSERT INTO tokens (user_id, meal_date, meal_type, token, status, generated_at) 
             VALUES (?, ?, ?, ?, 'unused', NOW())`,
            [meal.user_id, dateStr, mealType, token]
          );
          
          tokensCreated++;
          console.log(`[Token Scheduler] ✅ Token generated for user ${meal.user_id}, ${mealType}: ${token}`);
        } else {
          console.log(`[Token Scheduler] ⏭️ Token already exists for user ${meal.user_id}, ${mealType}`);
        }
      }
    }

    console.log(`[Token Scheduler] 🎉 Successfully generated ${tokensCreated} new tokens for ${dateStr} (Total meals: ${totalMeals})`);
    
    return { count: tokensCreated, date: dateStr };

  } catch (err) {
    console.error('[Token Scheduler] ❌ Error generating tokens:', err.message);
    throw err;
  }
}

function startScheduler() {
  // প্রতিদিন রাত ১০টায় চলবে
  cron.schedule('0 22 * * *', () => {
    console.log('[Token Scheduler] ⏰ Running 10 PM token generation...');
    generateTokensForTomorrow().catch(err => {
      console.error('[Token Scheduler] ❌ Scheduled job failed:', err);
    });
  });
  
  console.log('[Token Scheduler] 🚀 Scheduler started. Will run at 10 PM daily.');
}

module.exports = { startScheduler, generateTokensForTomorrow };