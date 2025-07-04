// Browser test for favorites functionality
// Run this in browser console after authentication

async function testFavoritesPermissions() {
  console.log('🔍 Testing favorites permissions...');
  
  try {
    // Get the db instance from the global scope
    const db = window.db || (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.dbInstance);
    
    if (!db) {
      console.error('❌ Database instance not found');
      return;
    }
    
    console.log('✅ Database instance found');
    
    // Test 1: Query poses (should work - public read)
    console.log('\n1️⃣ Testing poses query...');
    const posesResult = await db.query({ poses: {} });
    console.log(`✅ Poses query successful: ${posesResult.poses.length} poses`);
    
    // Test 2: Query user profile (should work if permissions are correct)
    console.log('\n2️⃣ Testing profile query...');
    const profilesResult = await db.query({ 
      profiles: { 
        $: { where: { id: 'current-user-profile-id' } } 
      } 
    });
    console.log(`✅ Profile query successful: ${profilesResult.profiles.length} profiles`);
    
    // Test 3: Query favorites (should work if permissions are correct)
    console.log('\n3️⃣ Testing favorites query...');
    const favoritesResult = await db.query({
      profiles: {
        favorites: {
          pose: {},
        },
      },
    });
    console.log(`✅ Favorites query successful: ${favoritesResult.profiles.length} profiles with favorites`);
    
    // Test 4: Create a test favorite (should work if permissions are correct)
    console.log('\n4️⃣ Testing favorite creation...');
    const testPoseId = posesResult.poses[0]?.id;
    if (testPoseId) {
      try {
        await db.transact([
          db.tx.favorites[crypto.randomUUID()].update({
            profileId: 'current-user-profile-id',
            poseId: testPoseId,
          })
        ]);
        console.log('✅ Test favorite created successfully');
      } catch (error) {
        console.error('❌ Failed to create test favorite:', error);
      }
    }
    
    console.log('\n🎉 Permissions test completed!');
    
  } catch (error) {
    console.error('❌ Error testing permissions:', error);
    
    if (error.message.includes('permission') || error.message.includes('denied')) {
      console.log('\n🚨 PERMISSION ERROR DETECTED');
      console.log('This confirms that permissions need to be configured in InstantDB dashboard.');
      console.log('See the permission-summary.md file for exact configuration needed.');
    }
  }
}

// Export for use in browser
window.testFavoritesPermissions = testFavoritesPermissions;

console.log('🔧 Favorites permission test loaded');
console.log('Run testFavoritesPermissions() in console after authentication');