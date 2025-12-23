const testCheckout = async () => {
  try {
    console.log('🔵 Testing checkout API...');
    
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        region: 'United States',
        adultChannels: true,
        plan: 'plan_3m'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS - Checkout API works!');
      console.log('Order ID:', data.orderId);
      console.log('Payment Link:', data.paymentLink);
      console.log('Expected redirect to:', data.paymentLink);
      
      if (data.paymentLink && data.paymentLink.includes('nowpayments.io')) {
        console.log('✅ CORRECT - Link is to NOWPayments!');
      }
    } else {
      console.log('❌ ERROR:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testCheckout();
