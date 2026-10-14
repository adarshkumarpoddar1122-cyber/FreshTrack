import React, { useState } from 'react';
import { AuthUser, ScreenId } from '../types';
import { EMBLEM_URL } from '../components/Header';

interface LoginScreenProps {
  onLogin: (user: AuthUser, redirectScreen?: ScreenId) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'household' | 'institution'>('household');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickLogin = (role: 'household' | 'institution') => {
    if (role === 'household') {
      const demoUser: AuthUser = {
        id: 'user-household-demo',
        name: 'Sarah Jenkins',
        email: 'sarah.home@freshtrack.app',
        role: 'household',
        title: 'Home Kitchen Lead',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida/AEtjO1Xpx6yuHU0kuf0YPjJTx3NHY731DChLZhhHhlBFJ7S4KC0cGW4EvqK-ltnqc8inZBUr8O5Au8VfqNAcu_tF0B8Eht02nwskeaeKFwtPQx6oeHKaFuzW7ZYWr12Ed0FxQ_FlsfhN0czTpeNXeISC7NMbgNKbh6zsAIYqXD6s5HnpY-jKY02tDM32BqGQWcc1vyUnq4S71g1ld3l4bEDHkFQbJO157pmBLQW_ZdxbyolAt3I9mkR_DsuVHQZ8J8OuWc4RUsG0ewCE2Q',
      };
      onLogin(demoUser, 'home');
    } else {
      const demoUser: AuthUser = {
        id: 'user-institution-demo',
        name: 'Marcus R.',
        email: 'marcus.shift@centraldining.edu',
        role: 'institution',
        title: 'Dining Hall Shift Lead',
        avatarUrl: EMBLEM_URL,
      };
      onLogin(demoUser, 'institution-dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email or username');
      return;
    }

    if (!password || password.length < 3) {
      setErrorMsg('Please enter a password (min 3 characters)');
      return;
    }

    const userName = name.trim() || trimmedEmail.split('@')[0] || (selectedRole === 'household' ? 'Household User' : 'Kitchen Staff');
    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: userName,
      email: trimmedEmail,
      role: selectedRole,
      title: selectedRole === 'household' ? 'Pantry Manager' : 'Intake Officer',
      avatarUrl:
        selectedRole === 'household'
          ? 'https://lh3.googleusercontent.com/aida/AEtjO1Xpx6yuHU0kuf0YPjJTx3NHY731DChLZhhHhlBFJ7S4KC0cGW4EvqK-ltnqc8inZBUr8O5Au8VfqNAcu_tF0B8Eht02nwskeaeKFwtPQx6oeHKaFuzW7ZYWr12Ed0FxQ_FlsfhN0czTpeNXeISC7NMbgNKbh6zsAIYqXD6s5HnpY-jKY02tDM32BqGQWcc1vyUnq4S71g1ld3l4bEDHkFQbJO157pmBLQW_ZdxbyolAt3I9mkR_DsuVHQZ8J8OuWc4RUsG0ewCE2Q'
          : EMBLEM_URL,
    };

    onLogin(user, selectedRole === 'household' ? 'home' : 'institution-dashboard');
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-2 sm:py-6 px-1">
      {/* Brand & Hero Frame */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-3 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-2 rounded-full bg-secondary-container/40 blur-xl"></div>
          {/* Logo Frame */}
          <div className="relative w-full h-full rounded-3xl p-2 bg-surface-container-lowest shadow-[0_12px_32px_-6px_rgba(27,94,32,0.12),0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center overflow-hidden">
            <img
              alt="FreshTrack emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl"
              src={EMBLEM_URL}
            />
          </div>

          <div className="absolute -bottom-1 -left-2 bg-surface-container-lowest text-primary rounded-full px-2.5 py-0.5 shadow-md flex items-center gap-1">
            <span
              className="material-symbols-outlined text-sm text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="font-label-sm text-[10px] font-bold text-primary">FreshTrack</span>
          </div>

          <div className="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-fixed rounded-full px-2 py-0.5 shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span className="font-label-sm text-[10px] font-semibold">Zero Waste</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary mb-1">
          <span className="material-symbols-outlined text-sm">nest_eco_leaf</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
            Smart Food Inventory
          </span>
        </div>

        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold leading-tight">
          Track today,
          <br />
          save tomorrow.
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-1">
          Sign in to manage expiry alerts, zero-waste recipes, and dining compliance.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="bg-surface-container-low p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 mb-5 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('household');
            setErrorMsg(null);
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-label-md text-label-md transition-all ${
            selectedRole === 'household'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-lg"
            style={selectedRole === 'household' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            kitchen
          </span>
          <span>Household</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('institution');
            setErrorMsg(null);
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-label-md text-label-md transition-all ${
            selectedRole === 'institution'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-lg">school</span>
          <span>Institution</span>
        </button>
      </div>

      {/* 1-Tap Quick Demo Access Box */}
      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_4px_20px_-2px_rgba(27,94,32,0.06)] border border-surface-container-high/60 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-base">bolt</span>
            <span className="font-label-md text-label-md text-primary font-bold">
              Instant 1-Tap Demo Access
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-semibold">
            Pre-loaded
          </span>
        </div>

        {selectedRole === 'household' ? (
          <button
            type="button"
            onClick={() => handleQuickLogin('household')}
            className="w-full p-3 rounded-2xl bg-secondary-container/25 hover:bg-secondary-container/40 text-on-surface flex items-center justify-between transition-all active:scale-[0.98] text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0 shadow-xs">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cottage
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-label-md text-label-md text-primary font-bold block truncate">
                  Sarah Jenkins (Household)
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate block">
                  Family pantry • 7 items tracked • Zero-waste
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleQuickLogin('institution')}
            className="w-full p-3 rounded-2xl bg-secondary-container/25 hover:bg-secondary-container/40 text-on-surface flex items-center justify-between transition-all active:scale-[0.98] text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">badge</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-md text-label-md text-primary font-bold block truncate">
                  Marcus R. (Shift Lead)
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate block">
                  Central Dining Hall • HACCP Compliance &amp; Bulk
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-space-sm mb-5">
        <div className="h-0.5 flex-1 bg-surface-container-highest rounded-full"></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest px-1">
          {isSignUp ? 'or create new account' : 'or sign in with credentials'}
        </span>
        <div className="h-0.5 flex-1 bg-surface-container-highest rounded-full"></div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-4 mb-4"
      >
        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container text-error font-body-sm text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {isSignUp && (
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="auth-name">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-lg">
                person
              </span>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'household' ? 'e.g., Alex Johnson' : 'e.g., Marcus R.'}
                className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="auth-email">
            {selectedRole === 'household' ? 'Email Address' : 'Staff ID / Work Email'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-lg">
              mail
            </span>
            <input
              id="auth-email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                selectedRole === 'household' ? 'name@example.com' : 'officer@campusdining.edu'
              }
              className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="auth-password">
              Password {selectedRole === 'institution' && '/ PIN'}
            </label>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => handleQuickLogin(selectedRole)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Use demo credentials
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-lg">
              lock
            </span>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 text-on-surface-variant hover:text-on-surface"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">Stay signed in</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-full flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(27,94,32,0.35)] active:scale-[0.98] transition-all cursor-pointer mt-1"
        >
          <span className="material-symbols-outlined text-xl">login</span>
          <span>
            {isSignUp
              ? `Create ${selectedRole === 'household' ? 'Household' : 'Staff'} Account`
              : `Sign In to FreshTrack`}
          </span>
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setIsSignUp((v) => !v);
              setErrorMsg(null);
            }}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            {isSignUp ? (
              <span>Already have an account? <strong className="text-primary font-bold">Sign In</strong></span>
            ) : (
              <span>New to FreshTrack? <strong className="text-primary font-bold">Create Free Account</strong></span>
            )}
          </button>
        </div>
      </form>

      {/* Guest Exploration Option */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => handleQuickLogin('household')}
          className="text-xs text-on-surface-variant hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-surface-container active:scale-95 inline-flex items-center gap-1"
        >
          <span>Continue as Guest</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
