import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State for the soft skill input by the user for the AI tips section
  const [softSkillInput, setSoftSkillInput] = useState('');
  // State to store the generated tips from the LLM
  const [generatedTips, setGeneratedTips] = useState('');
  // State to manage loading indicator during API call for tips
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  // State to handle any errors from the AI API call for tips
  const [tipsError, setTipsError] = useState('');

  // States for Personal Branding Statement Generator
  const [brandingInput, setBrandingInput] = useState('');
  const [generatedBrandingStatement, setGeneratedBrandingStatement] = useState('');
  // State to manage loading indicator during AI API call for branding
  const [isLoadingBranding, setIsLoadingBranding] = useState(false);
  // State to handle any errors from the AI API call for branding
  const [brandingError, setBrandingError] = useState('');

  // States for LinkedIn Post Generator
  const [linkedinPostInput, setLinkedinPostInput] = useState('');
  const [generatedLinkedinPost, setGeneratedLinkedinPost] = useState('');
  // State to manage loading indicator during AI API call for LinkedIn post
  const [isLoadingLinkedinPost, setIsLoadingLinkedinPost] = useState(false);
  // State to handle any errors from the AI API call for LinkedIn post
  const [linkedinPostError, setLinkedinPostError] = useState('');


  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for dark mode. Initialize from localStorage or default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark' ? true : false;
  });

  // State for mobile dark mode options visibility
  const [isMobileDarkModeOptionsOpen, setIsMobileDarkModeOptionsOpen] = useState(false);


  // States for Contact Form submission
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState(''); // 'success' or 'error'

  // State for Free Consultation Modal visibility
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // State for generic info modal visibility
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState('');

  // --- Hero Slider States ---
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const heroSlides = [
    {
      title: "Master Communication, Transform Your Career",
      subtitle: "Develop compelling verbal and non-verbal skills for impactful interactions."
    },
    {
      title: "Lead with Confidence, Inspire Your Team",
      subtitle: "Cultivate authentic leadership qualities that drive motivation and success."
    },
    {
      title: "Boost Emotional Intelligence, Build Stronger Relationships",
      subtitle: "Understand and manage emotions to foster empathy and effective collaboration."
    },
    {
      title: "Navigate Conflict Effectively, Achieve Win-Win Outcomes",
      subtitle: "Learn strategies to resolve disagreements constructively and strengthen bonds."
    },
    {
      title: "Unlock Your Personal Brand, Stand Out in Your Industry",
      subtitle: "Define and articulate your unique value proposition to elevate your professional presence."
    },
    {
      title: "Enhance Productivity, Achieve Your Professional Goals",
      subtitle: "Acquire time management and organizational skills to maximize your efficiency."
    }
  ];

  // Effect for auto-sliding hero content
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        (prevIndex + 1) % heroSlides.length
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval); // Cleanup interval on component unmount
  }, [heroSlides.length]);


  // Effect to apply dark mode class to HTML tag and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Set smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    setIsMobileDarkModeOptionsOpen(false); // Close options when toggled
  };

  // Function to open generic info modal
  const openInfoModal = (title, content) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setIsInfoModalOpen(true);
  };

  // Function to close generic info modal
  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setInfoModalTitle('');
    setInfoModalContent('');
  };


  // Function to call the Gemini API and get soft skill tips
  const generateSoftSkillTips = async () => {
    setIsLoadingTips(true);
    setTipsError('');
    setGeneratedTips(''); // Clear previous tips

    if (!softSkillInput.trim()) {
      setTipsError('Please enter a soft skill.');
      setIsLoadingTips(false);
      return;
    }

    try {
      let chatHistory = [];
      const prompt = `Provide 3 actionable tips for improving "${softSkillInput}" soft skill. Focus on practical advice and keep each tip concise and numbered.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: chatHistory
      };

      // IMPORTANT: For local development, replace "" with your actual Gemini API Key.
      // This line is intentionally left blank for the Canvas environment, where the key is injected.
      const apiKey = "AIzaSyBGyYz72RjipMSLkq5KoHupM02-X5ZPeVY"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedTips(text);
      } else {
        setTipsError('Could not generate tips. Please try again.');
      }
    } catch (e) {
      console.error("Error calling Gemini API:", e);
      setTipsError('Failed to fetch tips. Please check your connection or try again.');
    } finally {
      setIsLoadingTips(false);
    }
  };

  // Function to call the Gemini API and generate a personal branding statement
  const generateBrandingStatement = async () => {
    setIsLoadingBranding(true);
    setBrandingError('');
    setGeneratedBrandingStatement(''); // Clear previous statement

    if (!brandingInput.trim()) {
      setBrandingError('Please describe your professional identity with specific details.');
      setIsLoadingBranding(false);
      return;
    }

    try {
      let chatHistory = [];
      // Modified prompt for more direct output
      const prompt = `Generate a concise and impactful personal branding statement (2-3 sentences) based on the following specific professional identity description: "${brandingInput}". Ensure the statement highlights unique value and target audience clearly, without offering multiple options.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: chatHistory
      };

      const apiKey = "AIzaSyBGyYz72RjipMSLkq5KoHupM02-X5ZPeVY"; // Canvas will provide
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedBrandingStatement(text);
      } else {
        setBrandingError('Could not generate a branding statement. Please try again with more specific details.');
      }
    } catch (e) {
      console.error("Error calling Gemini API for branding:", e);
      setBrandingError('Failed to fetch branding statement. Please check your connection or try again.');
    } finally {
      setIsLoadingBranding(false);
    }
  };

  // Function to generate LinkedIn Post with emojis
  const generateLinkedinPost = async () => {
    setIsLoadingLinkedinPost(true);
    setLinkedinPostError('');
    setGeneratedLinkedinPost('');

    if (!linkedinPostInput.trim()) {
      setLinkedinPostError('Please provide details for your LinkedIn post (topic, key points, purpose).');
      setIsLoadingLinkedinPost(false);
      return;
    }

    try {
      let chatHistory = [];
      // Modified prompt to explicitly ask for emojis and LinkedIn format
      const prompt = `Generate a professional, engaging LinkedIn post based on the following details: "${linkedinPostInput}". The post should be 3-5 paragraphs, include relevant emojis (like 👋, 👇, ✅, 🎓, 💼, 💡, 🧠, 🌐, �️, 🕵️, 🎙️, 🌍, 🚀), and incorporate relevant hashtags. Ensure a clear call to action or engagement prompt.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: chatHistory
      };

      const apiKey = "AIzaSyBGyYz72RjipMSLkq5KoHupM02-X5ZPeVY"; // Canvas will provide
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedLinkedinPost(text);
      } else {
        setLinkedinPostError('Could not generate LinkedIn post. Please try again.');
      }
    } catch (e) {
      console.error("Error calling Gemini API for LinkedIn post:", e);
      setLinkedinPostError('Failed to fetch LinkedIn post. Please check your connection or try again.');
    } finally {
      setIsLoadingLinkedinPost(false);
    }
  };


  // Function to handle contact form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingForm(true);
    setFormMessage('');
    setFormMessageType('');

    // Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree form ID
    // You'll get this ID after creating a form on formspree.io and associating it with vishalvrajpurohit6@gmail.com
    const formUrl = "https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT"; // IMPORTANT: Update this URL!

    const formData = new FormData(event.target);

    try {
      const response = await fetch(formUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      });

      if (response.ok) {
        setFormMessage('Thank you for your message! We will get back to you soon.');
        setFormMessageType('success');
        event.target.reset(); // Clear the form fields
      } else {
        const data = await response.json();
        if (data.errors) {
          setFormMessage(data.errors.map(error => error.message).join(', '));
        } else {
          setFormMessage('Oops! There was a problem submitting your form.');
        }
        setFormMessageType('error');
      }
    } catch (e) {
      console.error("Form submission error:", e);
      setFormMessage('Failed to submit form. Please check your connection.');
      setFormMessageType('error');
    } finally {
      setIsSubmittingForm(false);
    }
  };


  return (
    // Apply dark mode class to the root div based on state
    <div className={`min-h-screen font-inter antialiased ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Tailwind CSS CDN script - ensures Tailwind classes work */}
      
      {/* Viewport meta tag for responsive behavior */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* Google Fonts - Inter for professional typography */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header Section */}
      <header className={`shadow-sm p-4 md:p-6 sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto flex items-center justify-between flex-wrap">
          {/* Left Section: Dark Mode Toggle (Icon on mobile, text on desktop) */}
          <div className="order-1 flex items-center space-x-1">
            {/* Mobile-only toggle icon */}
            <button
              onClick={() => setIsMobileDarkModeOptionsOpen(!isMobileDarkModeOptionsOpen)}
              className={`md:hidden p-2 rounded-lg transition duration-300 ease-in-out focus:outline-none ${isDarkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-indigo-50'}`}
              aria-label="Toggle dark mode options"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.292 10.999a.5.5 0 00-.817-.432C15.344 11.238 12 14.5 12 14.5s-3.344-3.262-4.475-4.062a.5.5 0 00-.817.432C6.917 11.066 10 14.28 10 14.28s3.083-3.214 4.192-4.001a.5.5 0 00-.817-.432zM10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 110 12 6 6 0 010-12z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 14a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-7-2.732a1 1 0 01-.368.932l-.99.56a1 1 0 01-1.3-.396l-.56-.99a1 1 0 01.396-1.3l.99-.56a1 1 0 011.3.396l.56.99a1 1 0 01-.396 1.3zm8-5.5a1 1 0 01-.368.932l-.99.56a1 1 0 01-1.3-.396l-.56-.99a1 1 0 01.396-1.3l.99-.56a1 1 0 011.3.396l.56.99a1 1 0 01-.396 1.3zM10 11a1 1 0 100-2 1 1 0 000 2zm-5.732-2a1 1 0 01-.56-.99l.396-1.3a1 1 0 011.3-.396l.99.56a1 1 0 01.368.932l-.56.99a1 1 0 01-1.3.396zM4 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm8-7a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
              )}
            </button>
            {/* Desktop toggle text */}
            <span className={`hidden md:inline-block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Light Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`hidden md:inline-flex relative flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'bg-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800' : 'bg-gray-200 focus:ring-indigo-500'}`}
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}
              ></span>
            </button>
            <span className={`hidden md:inline-block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dark Mode</span>
          </div>

          {/* Mobile Dark Mode Options Overlay */}
          {isMobileDarkModeOptionsOpen && (
            <div className={`md:hidden fixed top-16 left-4 p-4 rounded-lg shadow-lg z-50 flex flex-col space-y-2 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Light Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'bg-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800' : 'bg-gray-200 focus:ring-indigo-500'}`}
                  aria-pressed={isDarkMode}
                  aria-label="Toggle dark mode"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}
                  ></span>
                </button>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dark Mode</span>
              </div>
            </div>
          )}

          {/* Center Section: Neeraj Kumar Name */}
          {/* On mobile, this will be centered on its own line after the dark mode toggle */}
          {/* On desktop, it will be centered between the left and right items */}
          <div className="flex-grow flex justify-center order-2 w-full md:w-auto"> 
            <a href="#home" className={`text-2xl md:text-3xl font-bold text-indigo-700 rounded-lg p-2 transition duration-300 ease-in-out hover:scale-105 animate-fade-in ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
              Neeraj Kumar
            </a>
          </div>

          {/* Right Section: Desktop Nav / Mobile Hamburger / Free Consultation */}
          <div className="flex items-center space-x-4 order-3 w-auto"> {/* Adjusted space-x */}
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#about" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                About Me
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#services" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Services
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#workshops" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Workshops/Programs
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#testimonials" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Testimonials
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#blog" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Blog/Resources
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#online-courses" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Online Courses
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#events" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Events/Calendar
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#podcast-videos" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Podcast Videos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#ai-features" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}> {/* New AI Features Link */}
                AI Features
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); }} className={`group relative font-medium text-base px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50 ${isDarkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600'}`}>
                Contact
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            </nav>
            {/* Free Consultation Button (Desktop-only) */}
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="ml-4 bg-indigo-600 text-white font-bold py-2 px-5 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 hidden md:block"
            >
              Free Consultation
            </button>
            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-lg transition duration-300 ease-in-out focus:outline-none ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-indigo-50'}`}
                >
                  {/* Hamburger or Close icon based on state */}
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                  </svg>
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`md:hidden fixed inset-0 bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-6 animate-fade-in-down ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-lg focus:outline-none ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-indigo-50'}`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <a href="#home" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Home</a>
            <a href="#about" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>About Me</a>
            <a href="#services" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Services</a>
            <a href="#workshops" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Workshops/Programs</a>
            <a href="#testimonials" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Testimonials</a>
            <a href="#blog" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Blog/Resources</a>
            <a href="#online-courses" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Online Courses</a>
            <a href="#events" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Events/Calendar</a>
            <a href="#podcast-videos" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Podcast Videos</a>
            <a href="#ai-features" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}> {/* New AI Features Link */}
                AI Features
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); }} className={`text-2xl font-semibold transition duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}>Contact</a>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsConsultationModalOpen(true); }}
              className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
            >
              Free Consultation
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className={`relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-32 overflow-hidden shadow-xl rounded-b-3xl ${isDarkMode ? 'from-gray-800 to-gray-700' : ''}`}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="h-48 md:h-56 flex flex-col justify-center items-center"> {/* Fixed height for slider */}
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute w-full px-4 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-slide-up"> {/* Adjusted text size for mobile */}
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 animate-fade-in-slide-up animation-delay-300 mb-8"> {/* Adjusted text size for mobile and increased mb */}
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            }}
            className={`font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl mt-8 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white text-indigo-700 hover:bg-gray-100'}`}
          >
            Explore Programs
          </button>
        </div>
        {/* Abstract background shapes for visual appeal */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" fillOpacity="0.1" d="M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,144C672,139,768,149,864,138.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            <path fill="#ffffff" fillOpacity="0.05" d="M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,138.7C672,160,768,192,864,213.3C960,235,1056,245,1152,240C1248,235,1344,213,1392,202.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12">
        {/* About Me Section */}
        <section id="about" className={`mb-16 p-8 rounded-2xl shadow-xl border flex flex-col md:flex-row items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8 flex justify-center md:flex-none"> {/* Added md:flex-none to prevent it from growing on desktop */}
            {/* Trainer Photo */}
            <img
              src="/pic.jpg" // Updated path here
              alt="Neeraj Kumar"
              className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover shadow-lg border-4 border-indigo-200"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left md:flex-grow"> {/* Added md:flex-grow to allow text to fill remaining space */}
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>About Neeraj Kumar</h2>
            <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Hello! I'm Neeraj Kumar, a distinguished Learning and Development Professional, acclaimed Soft Skills Coach, and Success Strategist. Recognized as a LinkedIn Influencer & Top Voice in 2024, I am deeply passionate about transforming aspiring professionals into impactful leaders.
            </p>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              With a strong focus on practical application, my expertise encompasses Personal Brand Building, Emotional Intelligence, and Communication mastery. As a dedicated Soft Skills Trainer, I've had the privilege of guiding over 100,000 professionals across various sectors to excel in their careers.
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              My mission is to deliver dynamic and actionable training that equips individuals and teams with the essential soft skills needed for unparalleled success and growth in today's competitive landscape. I also share insights as a Podcaster and contribute as a Personal Branding Expert, helping individuals cultivate a powerful professional presence.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Our Services</h2>
          <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Neeraj Kumar offers a diverse range of specialized services designed to empower individuals and organizations in their professional and personal development journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card: Life Coaching */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Life Coaching</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Unlock your personal potential and achieve your life goals with personalized guidance and strategic action plans.
              </p>
            </div>
            {/* Service Card: Interview Preparation */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Interview Preparation</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Master interview techniques, build confidence, and learn strategies to ace your next job interview.
              </p>
            </div>
            {/* Service Card: Public Speaking */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Public Speaking</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Develop compelling presentation skills, overcome stage fright, and deliver impactful speeches with authority.
              </p>
            </div>
            {/* Service Card: Resume Writing */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Resume Writing</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Craft a professional and impactful resume that highlights your strengths and gets you noticed by top employers.
              </p>
            </div>
            {/* Service Card: Digital Marketing */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Digital Marketing Consulting</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Gain insights and strategies for effective digital presence, personal branding, and online engagement.
              </p>
            </div>
            {/* Service Card: Educational Consulting */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Educational Consulting</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Expert guidance for students and professionals seeking to navigate academic and career paths effectively.
              </p>
            </div>
            {/* Service Card: Leadership Development */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Leadership Development</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Cultivate essential leadership qualities, build high-performing teams, and drive organizational success.
              </p>
            </div>
            {/* Service Card: Resume Review */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Resume Review</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Receive expert feedback and improvements on your resume to maximize your job application success.
              </p>
            </div>
            {/* Service Card: Training (General) */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Professional Training</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Customized training modules covering a wide array of soft skills to enhance individual and team capabilities.
              </p>
            </div>
            {/* Service Card: Career Development Coaching */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Career Development Coaching</h3>
              <p className={`text-gray-700 ${isDarkMode ? 'text-gray-200' : ''}`}>
                Strategize your career path, identify growth opportunities, and build a roadmap for long-term professional success.
              </p>
            </div>
          </div>
        </section>

        {/* Workshops/Programs Section */}
        <section id="workshops" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Workshops & Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Workshop Card 1 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Effective Public Speaking</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Conquer your fear of public speaking and deliver engaging presentations with confidence. Learn techniques for voice modulation, body language, and audience engagement.
              </p>
              <button
                onClick={() => openInfoModal('Effective Public Speaking Workshop', 'Details about this workshop are coming soon! This program helps you conquer public speaking fears and deliver impactful presentations.')}
                className={`py-2 px-4 rounded-lg transition duration-300 ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>Learn More</button>
            </div>
            {/* Workshop Card 2 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Emotional Intelligence for Leaders</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Develop higher emotional intelligence to better understand and manage your emotions and those of others, leading to more effective leadership.
              </p>
              <button
                onClick={() => openInfoModal('Emotional Intelligence for Leaders Workshop', 'More details about this workshop are coming soon! This program focuses on developing higher emotional intelligence for effective leadership.')}
                className={`py-2 px-4 rounded-lg transition duration-300 ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>Learn More</button>
            </div>
            {/* Workshop Card 3 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Advanced Negotiation Skills</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Master negotiation strategies to achieve win-win outcomes in business and personal interactions. Focus on active listening, persuasion, and conflict resolution.
              </p>
              <button
                onClick={() => openInfoModal('Advanced Negotiation Skills Workshop', 'Information about this workshop will be available shortly! Learn to master negotiation strategies for win-win outcomes.')}
                className={`py-2 px-4 rounded-lg transition duration-300 ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>Learn More</button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial Card 1 */}
            <div className={`p-6 rounded-xl shadow-md border text-center hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <p className={`text-lg italic mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "The leadership development program transformed our management team. We've seen a remarkable improvement in communication and team cohesion."
              </p>
              <p className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>- Aditi Sharma, CEO of Tech Innovations</p>
            </div>
            {/* Testimonial Card 2 */}
            <div className={`p-6 rounded-xl shadow-md border text-center hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <p className={`text-lg italic mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "Highly recommend the communication skills workshop! I feel much more confident in my presentations and daily interactions."
              </p>
              <p className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>- Rohan Mehta, Marketing Manager</p>
            </div>
            {/* Testimonial Card 3 */}
            <div className={`p-6 rounded-xl shadow-md border text-center hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <p className={`text-lg italic mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "The team-building exercises were fantastic. Our team dynamics have never been better, and we're more productive than ever."
              </p>
              <p className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>- Priya Singh, Project Lead</p>
            </div>
            {/* Testimonial Card 4 */}
            <div className={`p-6 rounded-xl shadow-md border text-center hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <p className={`text-lg italic mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "The personalized coaching I received was invaluable. My confidence has soared, and I'm tackling challenges with a new mindset."
              </p>
              <p className={`font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>- Sameer Khan, Entrepreneur</p>
            </div>
          </div>
        </section>

        {/* Blog/Resources Section */}
        <section id="blog" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Our Blog & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post Card 1 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>The Power of Active Listening in Leadership</h3>
              <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Learn how active listening can transform your leadership style and improve team dynamics. Discover practical tips to become a better listener.
              </p>
              <button type="button" className={`font-medium hover:underline bg-transparent border-none p-0 cursor-pointer text-left ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Read More →</button>
            </div>
            {/* Blog Post Card 2 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>5 Strategies for Effective Conflict Resolution</h3>
              <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Conflict is inevitable, but how you handle it makes all the difference. Explore five proven strategies to resolve workplace disputes.
              </p>
              <button type="button" className={`font-medium hover:underline bg-transparent border-none p-0 cursor-pointer text-left ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Read More →</button>
            </div>
            {/* Blog Post Card 3 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Building Resilience: A Key Soft Skill for 2024</h3>
              <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                In today's fast-paced world, resilience is more important than ever. Understand how to build and strengthen your mental toughness.
              </p>
              <button type="button" className={`font-medium hover:underline bg-transparent border-none p-0 cursor-pointer text-left ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Read More →</button>
            </div>
          </div>
        </section>

        {/* Online Courses Section */}
        <section id="online-courses" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Our Online Courses</h2>
          <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Neeraj Kumar offers a diverse range of specialized services designed to empower individuals and organizations in their professional and personal development journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Course Card 1 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>The Complete Communication Masterclass</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                A comprehensive online course covering all aspects of effective communication, from interpersonal skills to persuasive speaking. Self-paced learning with interactive modules.
              </p>
              <button
                onClick={() => openInfoModal('The Complete Communication Masterclass', 'Enrollment details for this online course are coming soon! Master effective communication at your own pace.')}
                className={`py-2 px-5 rounded-full transition duration-300 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>Enroll Now</button>
            </div>
            {/* Course Card 2 */}
            <div className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Strategic Leadership for Emerging Managers</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Designed for new and aspiring leaders, this course equips you with the strategic thinking and practical tools to lead teams effectively.
              </p>
              <button
                onClick={() => openInfoModal('Strategic Leadership for Emerging Managers', 'Enrollment details for this online course are coming soon! Develop strategic leadership skills for new and aspiring managers.')}
                className={`py-2 px-5 rounded-full transition duration-300 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>Enroll Now</button>
            </div>
          </div>
        </section>

        {/* Events/Calendar Section */}
        <section id="events" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Upcoming Events & Workshops</h2>
          <div className="space-y-6">
            {/* Event 1 */}
            <div className={`p-6 rounded-xl shadow-md border flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="mb-4 md:mb-0 md:w-2/3 text-center md:text-left">
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Webinar: Mastering Virtual Communication</h3>
                <p className={`text-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Join us for a free webinar on how to communicate effectively in a remote work environment. Learn best practices for virtual meetings and presentations.
                </p>
              </div>
              <div className="md:w-1/3 text-center md:text-right">
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>July 15, 2024 | 10:00 AM IST</p>
                <button
                  onClick={() => openInfoModal('Webinar: Mastering Virtual Communication', 'Registration for this webinar is opening soon! Learn virtual communication best practices.')}
                  className={`mt-3 py-2 px-4 rounded-full transition duration-300 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>Register</button>
              </div>
            </div>
            {/* Event 2 */}
            <div className={`p-6 rounded-xl shadow-md border flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="mb-4 md:mb-0 md:w-2/3 text-center md:text-left">
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>In-Person Workshop: Advanced Team Building</h3>
                <p className={`text-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  An intensive full-day workshop designed to elevate your team's collaboration and problem-solving skills. Limited seats available!
                </p>
              </div>
              <div className="md:w-1/3 text-center md:text-right">
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>August 10, 2024 | Bengaluru, India</p>
                <button
                  onClick={() => openInfoModal('In-Person Workshop: Advanced Team Building', 'Registration for this in-person workshop is opening soon! Elevate your team’s collaboration and problem-solving skills.')}
                  className={`mt-3 py-2 px-4 rounded-full transition duration-300 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>Register</button>
              </div>
            </div>
          </div>
        </section>

        {/* Podcast Videos Section */}
        <section id="podcast-videos" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Podcast Videos</h2>
          <div className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore insightful discussions, interviews, and practical tips on soft skills from our podcast series.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Embedded YouTube Video 1 - Replace with actual video embeds */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/sXkBQLzLWCM" // Video 1
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 1: Leadership Skills"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Leadership Skills: A Key to Success</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                An insightful discussion on essential leadership qualities and how to cultivate them.
              </p>
            </div>
            {/* Embedded YouTube Video 2 - Replace with actual video embeds */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/buTTwc6mAN4" // Video 2
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 2: Effective Communication"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>The Power of Effective Communication</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Explore strategies for clear, concise, and impactful communication in all aspects of life.
              </p>
            </div>
            {/* Embedded YouTube Video 3 */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/NtSHiVsLLmc" // Video 3
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 3: Emotional Intelligence"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Emotional Intelligence for Success</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Understand how emotional intelligence can boost your leadership and personal relationships.
              </p>
            </div>
            {/* Embedded YouTube Video 4 */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/wMIjFg-Uaw0" // Video 4
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 4: Conflict Resolution"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Mastering Conflict Resolution</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Techniques and mindsets for resolving conflicts constructively in any environment.
              </p>
            </div>
            {/* Embedded YouTube Video 5 */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/m7qf8aGsXqg" // Video 5
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 5: Personal Branding"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Building Your Powerful Personal Brand</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Strategies to define and elevate your professional identity in today's competitive world.
              </p>
            </div>
            {/* Embedded YouTube Video 6 */}
            <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/58PHL__ltHc" // Video 6
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Podcast Video 6: Time Management"
                ></iframe>
              </div>
              <h3 className={`text-xl font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Effective Time Management for Productivity</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Unlock techniques to optimize your time and achieve maximum productivity in your daily tasks.
              </p>
            </div>
          </div>
        </section>


        {/* AI Features Section */}
        <section id="ai-features" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>AI-Powered Features</h2>
          <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Leverage the power of Artificial Intelligence to enhance your soft skills and personal brand.
          </p>

          {/* Personal Branding Statement Generator Sub-Section */}
          <div className="mb-16 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"> {/* Added mb-16 for spacing */}
            <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
              Generate Your Personal Branding Statement ✨
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label htmlFor="brandingInput" className={`block text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Describe your unique value, expertise, and target audience in detail:
                </label>
                <textarea
                  id="brandingInput"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  rows="4"
                  placeholder="Example: I'm a leadership coach who empowers emerging tech managers to build high-performing, agile teams, leading to increased project success rates and team morale."
                  value={brandingInput}
                  onChange={(e) => setBrandingInput(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={generateBrandingStatement}
                className={`w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition duration-300 ease-in-out hover:scale-105 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : ''}`}
                disabled={isLoadingBranding}
              >
                {isLoadingBranding ? 'Generating Statement...' : 'Craft My Statement ✨'}
              </button>

              {brandingError && (
                <p className="mt-4 text-red-600 text-center font-medium">{brandingError}</p>
              )}

              {generatedBrandingStatement && (
                <div className={`mt-8 p-6 border rounded-lg shadow-inner animate-fade-in ${isDarkMode ? 'bg-gray-700 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>Your Personal Branding Statement:</h3>
                  <p className={`prose max-w-none ${isDarkMode ? 'prose-invert text-gray-200' : 'prose-indigo text-gray-800'}`}>
                    {generatedBrandingStatement}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* LinkedIn Post Generator Sub-Section */}
          <div className="mb-16 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
              Generate LinkedIn Post ✍️
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label htmlFor="linkedinPostInput" className={`block text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Describe your post (topic, key points, call to action):
                </label>
                <textarea
                  id="linkedinPostInput"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  rows="4"
                  placeholder="Example: A post about the importance of active listening in leadership, encouraging comments on personal experiences."
                  value={linkedinPostInput}
                  onChange={(e) => setLinkedinPostInput(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={generateLinkedinPost}
                className={`w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition duration-300 ease-in-out hover:scale-105 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : ''}`}
                disabled={isLoadingLinkedinPost}
              >
                {isLoadingLinkedinPost ? 'Generating Post...' : 'Generate Post ✍️'}
              </button>

              {linkedinPostError && (
                <p className="mt-4 text-red-600 text-center font-medium">{linkedinPostError}</p>
              )}

              {generatedLinkedinPost && (
                <div className={`mt-8 p-6 border rounded-lg shadow-inner animate-fade-in ${isDarkMode ? 'bg-gray-700 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>Your LinkedIn Post:</h3>
                  <p className={`prose max-w-none whitespace-pre-wrap ${isDarkMode ? 'prose-invert text-gray-200' : 'prose-indigo text-gray-800'}`}>
                    {generatedLinkedinPost}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Soft Skill Tips Generator Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
              Get Instant Soft Skill Tips ✨
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label htmlFor="softSkillInput" className={`block text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Which soft skill are you interested in?
                </label>
                <input
                  type="text"
                  id="softSkillInput"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., Communication, Leadership, Conflict Resolution"
                  value={softSkillInput}
                  onChange={(e) => setSoftSkillInput(e.target.value)}
                />
              </div>
              <button
                onClick={generateSoftSkillTips}
                className={`w-full font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition duration-300 ease-in-out hover:scale-105 ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                disabled={isLoadingTips}
              >
                {isLoadingTips ? 'Generating Tips...' : 'Get Tips ✨'}
              </button>

              {tipsError && (
                <p className="mt-4 text-red-600 text-center font-medium">{tipsError}</p>
              )}

              {generatedTips && (
                <div className={`mt-8 p-6 border rounded-lg shadow-inner animate-fade-in ${isDarkMode ? 'bg-gray-700 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>Your Personalized Soft Skill Tips:</h3>
                  <p className={`prose max-w-none ${isDarkMode ? 'prose-invert text-gray-200' : 'prose-indigo text-gray-800'}`}>
                    {generatedTips.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className={`mb-16 p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className={`flex flex-col items-center md:items-start text-center md:text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Get in Touch</h3>
              <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Have questions or want to discuss your training needs? Feel free to reach out!
              </p>
              <div className="space-y-3 mt-4">
                <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  <a href="mailto:neeraj.4all.kr@gmail.com" className="hover:underline">neeraj.4all.kr@gmail.com</a>
                </p>
                <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74A1 1 0 0119 16v2a2 2 0 01-2 2H3a2 2 0 01-2-2V3z"></path></svg>
                  <a href="tel:+917291041408" className="hover:underline">+91 72910 41408</a>
                </p>
                <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                  Provident Wellworth City Dodhballapur Main Road Bangalore:561-203
                </p>
                {/* LinkedIn Icon and Link */}
                <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.986-.018-2.256-1.373-2.256-1.374 0-1.587 1.073-1.587 2.188v4.346H8.338V8.067h2.559v1.174h.036c.356-.675 1.227-1.373 2.494-1.373 2.665 0 3.153 1.756 3.153 4.04v4.62H16.338zM6.76 6.76h-2.7V8.067H6.76zM5.41 3.962c-.886 0-1.606.72-1.606 1.606s.72 1.606 1.606 1.606c.886 0 1.606-.72 1.606-1.606S6.296 3.962 5.41 3.962z" clipRule="evenodd"></path></svg>
                  <a href="https://linkedin.com/in/neeraj-kumarcertifiedinternationalcorporatetrainer" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn Profile</a>
                </p>
                {/* YouTube Icon and Link */}
                <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.516 11.234l-6.002 3.464a1 1 0 01-1.514-.866V6.168a1 1 0 011.514-.866l6.002 3.464a1 1 0 010 1.732z" clipRule="evenodd"></path></svg>
                  <a href="https://www.youtube.com/@SuccessMantrasByNeerajkumar/featured" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube Channel</a>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`p-6 rounded-xl shadow-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
              <h3 className={`text-2xl font-semibold mb-4 text-center ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Send us a Message</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
                  <input type="text" id="name" name="name" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} required />
                </div>
                <div>
                  <label htmlFor="email" className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Email</label>
                  <input type="email" id="email" name="email" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} required />
                </div>
                <div>
                  <label htmlFor="subject" className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                  <input type="text" id="subject" name="subject" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                </div>
                <div>
                  <label htmlFor="message" className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                  <textarea id="message" name="message" rows="4" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} required></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  disabled={isSubmittingForm}
                >
                  {isSubmittingForm ? 'Sending...' : 'Send Message'}
                </button>
                {formMessage && (
                  <p className={`mt-4 text-center font-medium ${formMessageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {formMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className={`py-8 mt-12 rounded-t-3xl ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Neeraj Kumar. All rights reserved.</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>Designed and developed by VISHAL RAJ PUROHIT</p>
        </div>
      </footer>

      {/* Generic Info Modal (for Learn More/Enroll/Register buttons) */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg shadow-xl max-w-lg w-full text-center relative ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}>
            <button
              onClick={closeInfoModal}
              className={`absolute top-4 right-4 p-2 rounded-full transition duration-300 focus:outline-none ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{infoModalTitle}</h3>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {infoModalContent}
            </p>
            <button
              onClick={closeInfoModal}
              className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Free Consultation Modal */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg shadow-xl max-w-lg w-full text-center relative ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}>
            <button
              onClick={() => setIsConsultationModalOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition duration-300 focus:outline-none ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Schedule Your Free Consultation!</h3>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ready to take the first step towards unlocking your full potential? Book a complimentary 30-minute consultation with Neeraj Kumar to discuss your goals and how our tailored programs can help.
            </p>
            <div className="space-y-4">
              <a
                href="#contact" // Link to the contact section
                onClick={() => {
                  setIsConsultationModalOpen(false); // Close modal
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}
              >
                Contact Us to Schedule
              </a>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Or reach out directly via: <a href="mailto:info@neerajkumar.com" className="underline hover:text-indigo-600">info@neerajkumar.com</a> | <a href="tel:+1234567890" className="underline hover:text-indigo-600">+1 (234) 567-890</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations (can be moved to a separate CSS file in a real project) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        /* New animation for subtle text slide-up */
        @keyframes fade-in-slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-slide-up {
          animation: fade-in-slide-up 0.8s ease-out forwards;
        }
        /* Delay for the subtitle */
        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .aspect-w-16 {
          position: relative;
          width: 100%;
        }
        .aspect-w-16::before {
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          display: block;
          content: '';
        }
        .aspect-h-9 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        html {
          scroll-behavior: smooth; /* Ensure smooth scrolling for anchor links */
        }
      `}</style>
    </div>
  );
};

export default App;