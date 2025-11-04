import React from 'react';

interface LandingPageProps {
  onStartGame: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590922494220-a21e643666c0?q=80&w=2500&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="bg-[#F3EADF] bg-opacity-95 p-8 md:p-12 rounded-lg shadow-2xl border-4 border-[#C19A6B] w-full max-w-2xl text-center flex flex-col items-center">
        
        <svg className="w-24 h-24 text-[#5a2d0c] mb-4" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 C 20 20, 20 80, 50 90 C 80 80, 80 20, 50 10 Z M 50 25 C 65 35, 65 65, 50 75 C 35 65, 35 35, 50 25 Z" />
          <path d="M40 20 C 30 40, 30 60, 40 80 M60 20 C 70 40, 70 60, 60 80" stroke="currentColor" strokeWidth="5" fill="none" />
        </svg>

        <p className="text-xl text-[#3D2B1F] mb-4 font-serif">
          Osmanlıyı Tema Alan Bu Oyunda Beylikten bir Cihan Devleti Olmaya Çalışacaksınız.
        </p>

        <button 
          onClick={onStartGame} 
          className="w-full max-w-md my-6 bg-[#8B4513] text-white py-4 px-6 rounded-lg hover:bg-[#A0522D] transition duration-300 text-4xl font-bold font-serif shadow-lg transform hover:scale-105"
        >
          Osmanlı'nın Mirası
        </button>
        
        <div className="border-t-2 border-[#C19A6B] w-3/4 mt-6 pt-6">
          <p className="text-lg text-[#5a2d0c] font-serif">
            Geliştirici: Kerem Değirmenci
          </p>
          <p className="text-md text-[#5a2d0c] font-serif">
            Yaş: 12
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
