// Mock email service for POC
// In production, this would integrate with SendGrid, AWS SES, etc.

export const sendVerificationEmail = async (email, code, managerName) => {
  // Mock implementation - just logs to console
  console.log('='.repeat(50));
  console.log('📧 MOCK EMAIL SERVICE');
  console.log('='.repeat(50));
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your employment for ${managerName} review`);
  console.log('');
  console.log(`Your verification code is: ${code}`);
  console.log('');
  console.log('This code expires in 24 hours.');
  console.log('='.repeat(50));

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    success: true,
    messageId: `mock-${Date.now()}`,
  };
};

export const generateVerificationCode = () => {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};
