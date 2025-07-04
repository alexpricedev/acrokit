/**
 * Browser Heart Button Test
 * 
 * Run this in the browser console at http://localhost:3000
 * to test heart button functionality with the deployed InstantDB schema.
 */

window.testHeartButtons = async () => {
  console.log('🚀 Starting Browser Heart Button Test...');
  
  // Test 1: Check if InstantDB is available
  console.log('\n🔧 Test 1: InstantDB Connection');
  try {
    if (window.db) {
      console.log('✅ InstantDB instance found');
      console.log('📊 DB Object:', window.db);
    } else {
      console.log('❌ InstantDB not found on window object');
    }
  } catch (error) {
    console.error('❌ InstantDB check failed:', error);
  }
  
  // Test 2: Check authentication state
  console.log('\n🔐 Test 2: Authentication State');
  try {
    // Look for auth state in React components
    const authButtons = document.querySelectorAll('[data-testid="auth-button"], button[class*="sign"], button[class*="login"]');
    console.log('🔍 Found auth buttons:', authButtons.length);
    
    // Check if user is signed in
    const userElements = document.querySelectorAll('[data-testid="user-profile"], [class*="user"], [class*="profile"]');
    console.log('👤 User elements found:', userElements.length);
    
    // Check for sign-in/sign-out buttons
    const signInButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.toLowerCase().includes('sign')
    );
    console.log('🔑 Sign-in related buttons:', signInButtons.map(btn => btn.textContent));
    
  } catch (error) {
    console.error('❌ Auth state check failed:', error);
  }
  
  // Test 3: Look for heart buttons
  console.log('\n💖 Test 3: Heart Button Detection');
  try {
    const heartButtons = document.querySelectorAll('[data-testid="heart-button"], button[class*="heart"], [class*="favorite"]');
    console.log('💖 Heart buttons found:', heartButtons.length);
    
    // Look for heart-related icons or text
    const heartIcons = document.querySelectorAll('svg, i, span').filter(el => 
      el.innerHTML.includes('heart') || el.innerHTML.includes('♥') || el.innerHTML.includes('🤍') || el.innerHTML.includes('❤️')
    );
    console.log('💕 Heart icons found:', heartIcons.length);
    
    // Check for poses gallery
    const posesGallery = document.querySelector('[data-testid="poses-gallery"], [class*="poses"], [class*="gallery"]');
    console.log('🏛️ Poses gallery found:', !!posesGallery);
    
    // Look for pose cards
    const poseCards = document.querySelectorAll('[data-testid="pose-card"], [class*="pose"], [class*="card"]');
    console.log('🃏 Pose cards found:', poseCards.length);
    
  } catch (error) {
    console.error('❌ Heart button detection failed:', error);
  }
  
  // Test 4: Check console for errors
  console.log('\n🐛 Test 4: Console Error Check');
  console.log('⚠️  Check browser console for any React or InstantDB errors');
  console.log('⚠️  Look for authentication errors or permission issues');
  
  // Test 5: Navigation test
  console.log('\n🧭 Test 5: Navigation Test');
  try {
    // Look for navigation elements
    const navElements = document.querySelectorAll('nav, [role="navigation"], [class*="nav"]');
    console.log('🧭 Navigation elements found:', navElements.length);
    
    // Look for gallery/poses navigation
    const galleryLinks = Array.from(document.querySelectorAll('a, button')).filter(el => 
      el.textContent.toLowerCase().includes('gallery') || 
      el.textContent.toLowerCase().includes('poses')
    );
    console.log('🏛️ Gallery navigation found:', galleryLinks.map(link => link.textContent));
    
  } catch (error) {
    console.error('❌ Navigation test failed:', error);
  }
  
  // Test 6: InstantDB query test
  console.log('\n📊 Test 6: InstantDB Query Test');
  try {
    if (window.db && window.db.useQuery) {
      console.log('✅ InstantDB useQuery available');
      console.log('📝 Try running: db.useQuery({ poses: {} })');
    } else {
      console.log('❌ InstantDB useQuery not available');
    }
  } catch (error) {
    console.error('❌ InstantDB query test failed:', error);
  }
  
  console.log('\n✨ Browser Test Complete!');
  console.log('\n🎯 Next Steps:');
  console.log('1. If not authenticated, sign in with real email');
  console.log('2. Navigate to poses gallery');
  console.log('3. Look for heart buttons on pose cards');
  console.log('4. Click heart buttons to test favorites');
  console.log('5. Check for InstantDB errors in console');
  console.log('6. Verify favorites persist across page refreshes');
  
  return {
    heartButtons: document.querySelectorAll('[data-testid="heart-button"], button[class*="heart"], [class*="favorite"]').length,
    poseCards: document.querySelectorAll('[data-testid="pose-card"], [class*="pose"], [class*="card"]').length,
    authButtons: document.querySelectorAll('[data-testid="auth-button"], button[class*="sign"], button[class*="login"]').length,
    hasInstantDB: !!window.db
  };
};

// Auto-run the test
window.testHeartButtons();

console.log('\n🚀 Heart Button Test Loaded!');
console.log('Run window.testHeartButtons() to test again');