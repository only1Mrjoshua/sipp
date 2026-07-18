import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Mail, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const emailFromUrl = searchParams.get('email') || '';
  
  // Get email from URL first, then localStorage, then fallback
  const [userEmail, setUserEmail] = useState('');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Set email on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('pending_email') || '';
    const email = emailFromUrl || storedEmail;
    setUserEmail(email);
    
    // If no email found, try to get from localStorage again after a moment
    if (!email) {
      const retryEmail = localStorage.getItem('pending_email');
      if (retryEmail) {
        setUserEmail(retryEmail);
      }
    }
  }, [emailFromUrl]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const numbers = paste.replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < numbers.length; i++) {
      newOtp[i] = numbers[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(numbers.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const email = userEmail || localStorage.getItem('pending_email') || '';
      if (!email) {
        setError('Email not found. Please try signing up again.');
        setLoading(false);
        return;
      }

      await authService.verifyOTP(email, otpValue);
      setSuccess(true);
      
      // Clear pending email
      localStorage.removeItem('pending_email');
      
      // Navigate based on role after 1.5 seconds
      setTimeout(() => {
        if (role === 'company') {
          navigate('/company');
        } else {
          navigate('/student');
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60);
    setError('');

    try {
      const email = userEmail || localStorage.getItem('pending_email') || '';
      if (!email) {
        setError('Email not found. Please try signing up again.');
        setResendDisabled(false);
        return;
      }
      await authService.resendOTP(email);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend OTP. Please try again.');
      setResendDisabled(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 bg-gradient-hero">
      <div className="w-full max-w-sm mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="bordered" padding="md" className="shadow-strong">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-primary-dark">Verify Your Account</h1>
              <p className="text-text-secondary mt-1 text-sm">
                We've sent a 6-digit verification code to your email
              </p>
              <div className="flex items-center justify-center mt-2 text-xs text-text-secondary">
                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{userEmail || 'Loading email...'}</span>
              </div>
              <div className="mt-1 text-xs text-text-muted">
                {role === 'company' ? 'Creating company account...' : 'Creating student account...'}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-status-error/10 text-status-error text-sm rounded-xl border border-status-error/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-status-success/10 text-status-success text-sm rounded-xl border border-status-success/20 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                Email verified successfully! Redirecting...
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center text-xl font-bold text-primary-dark border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                disabled={otp.join('').length !== 6 || success}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Verify Account
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-text-secondary">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={resendDisabled || success}
                  className={`text-primary font-medium hover:underline transition-colors ${
                    resendDisabled || success ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Resend
                </button>
              </p>
              {resendDisabled && (
                <p className="text-xs text-text-muted mt-1">
                  Resend available in {countdown}s
                </p>
              )}
            </div>

            <div className="mt-3 text-center">
              <Link to="/login" className="text-xs text-text-secondary hover:text-primary transition-colors">
                ← Back to Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VerifyOTP;