import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey there! I am your SEEDINK AI assistant. Ready to design your next semi-permanent body art? What kind of tattoo idea do you have in mind?' }
  ]);
  const [input, setInput] = useState('');
  
  // Lead collection state
  const [step, setStep] = useState(0); // 0: idea, 1: size, 2: placement, 3: contact (phone/email), 4: name, 5: completed
  const [leadData, setLeadData] = useState({
    tattooIdea: '',
    size: '',
    placement: '',
    phone: '',
    email: '',
    name: ''
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // Advance the conversation flow based on current step
    let nextStep = step;
    let updatedLeadData = { ...leadData };
    let botReply = '';

    if (step === 0) {
      updatedLeadData.tattooIdea = userText;
      botReply = 'That sounds awesome! What size are you thinking of? (e.g. 2x2 inches, 4x3 inches, or small/medium/large)';
      nextStep = 1;
    } else if (step === 1) {
      updatedLeadData.size = userText;
      botReply = 'Perfect. Where on your body would you like to place it? (e.g. inner arm, wrist, shoulder, ankle)';
      nextStep = 2;
    } else if (step === 2) {
      updatedLeadData.placement = userText;
      botReply = 'Got it! To send you custom mockups and pricing, could you share your email or phone number?';
      nextStep = 3;
    } else if (step === 3) {
      if (userText.includes('@')) {
        updatedLeadData.email = userText;
      } else {
        updatedLeadData.phone = userText;
      }
      botReply = 'And finally, what is your name so we know who we are designing for?';
      nextStep = 4;
    } else if (step === 4) {
      updatedLeadData.name = userText;
      botReply = 'Thank you! I have saved your tattoo request. Our design team will contact you with custom stencil mockups shortly! 🔱🎨';
      nextStep = 5;

      // Submit lead to backend
      try {
        const API_BASE = (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
          ? 'https://tatto-backend-4axz.onrender.com/api'
          : 'http://localhost:5000/api';
        await fetch(`${API_BASE}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedLeadData.name,
            email: updatedLeadData.email,
            phone: updatedLeadData.phone,
            tattooIdea: updatedLeadData.tattooIdea,
            size: updatedLeadData.size,
            placement: updatedLeadData.placement,
            chatHistory: [...newMessages, { sender: 'bot', text: botReply }].map(msg => ({
              sender: msg.sender,
              text: msg.text
            }))
          })
        });
      } catch (err) {
        console.error('Error submitting lead:', err);
      }
    } else {
      // Freeform chat after completion
      botReply = 'Our artists are already on your lead! If you need to make changes, just let us know when we reach out.';
    }

    setStep(nextStep);
    setLeadData(updatedLeadData);
    
    // Simulate slight delay for bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button 
        className="chatbot-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with AI tattoo helper"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--color-dark)',
          color: 'var(--color-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          border: '2px solid var(--color-accent)',
          zIndex: 999,
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
        )}
      </button>

      {/* Slide-out glassmorphic chat container */}
      {isOpen && (
        <div 
          className="chatbot-window"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '380px',
            height: '520px',
            borderRadius: '16px',
            background: 'rgba(15, 15, 17, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
            animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(90deg, #1a1a1e, #0f0f11)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }}></div>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold', margin: 0 }}>SEEDINK Artist Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0 }}>Custom Stencils & Ideas</p>
            </div>
          </div>

          {/* Messages */}
          <div 
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.sender === 'user' ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                  color: msg.sender === 'user' ? 'var(--color-dark)' : '#f3f4f6',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              background: '#121215',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your tattoo idea..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '10px 18px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                color: 'var(--color-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
