import React from 'react';
import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          <h1 className="text-xl font-['Poppins'] font-semibold">SketchMix</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <button className="flex items-center text-sm font-medium hover:text-white transition">
                <i className="fas fa-question-circle mr-1"></i> Help
              </button>
            </li>
            <li>
              <Link href="/gallery" className="flex items-center text-sm font-medium hover:text-white transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gallery
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
