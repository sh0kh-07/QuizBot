import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import { wisdomData } from '../../Data/wisdomData';

// Перемешивание массива
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Форматирование даты
const formatDate = (date, language) => {
    const dateObj = new Date(date);

    if (language === 'uz') {
        const monthsUz = [
            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
            'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
        ];
        return `${dateObj.getDate()} ${monthsUz[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    }

    return dateObj.toLocaleDateString(
        language === 'en' ? 'en-US' : 'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );
};

export default function Wisdom() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language || 'ru';

    const [shuffledQuotes, setShuffledQuotes] = useState([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [fadeDirection, setFadeDirection] = useState('in');

    const animationTimeout = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        setShuffledQuotes(shuffleArray(wisdomData));

        return () => clearTimeout(animationTimeout.current);
    }, []);

    const getCurrentQuote = () => {
        if (!shuffledQuotes.length) return null;
        const quote = shuffledQuotes[currentQuoteIndex];
        return {
            ...quote,
            text: quote.text[currentLanguage] || quote.text.ru,
            publishedDate: quote.publishedDate || new Date().toISOString(),
        };
    };

    const changeQuote = (direction) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setFadeDirection('out');

        animationTimeout.current = setTimeout(() => {
            setCurrentQuoteIndex((prev) => {
                if (direction === 'next') {
                    return prev === shuffledQuotes.length - 1 ? 0 : prev + 1;
                }
                return prev === 0 ? shuffledQuotes.length - 1 : prev - 1;
            });

            requestAnimationFrame(() => {
                setFadeDirection('in');
                setIsAnimating(false);
            });
        }, 300);
    };

    const currentQuote = getCurrentQuote();
    if (!currentQuote) return null;

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
            {/* Фон */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-16 w-32 h-32 md:w-64 md:h-64 rounded-full opacity-5 bg-gray-800 dark:bg-gray-200 transition-colors duration-500"></div>
                <div className="absolute bottom-1/4 -right-16 w-40 h-40 md:w-80 md:h-80 rounded-full opacity-5 bg-gray-800 dark:bg-gray-200 transition-colors duration-500"></div>
                <div className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 opacity-30"></div>
                <div className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 opacity-30"></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-4xl">
                <div className="mb-12 md:mb-16" data-aos="fade-up">
                    <div className="relative">
                        {/* КАРТОЧКА (ключ — фикс бага) */}
                        <div
                            key={currentQuoteIndex}
                            className={`bg-card-light dark:bg-card-dark rounded-3xl p-4 md:p-6 lg:p-10 border border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-500 ${fadeDirection === 'in'
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 translate-y-4'
                                }`}
                        >
                            <div className="absolute top-4 md:top-6 left-4 md:left-6 text-3xl md:text-4xl text-gray-200 dark:text-gray-800">"</div>
                            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 text-3xl md:text-4xl text-gray-200 dark:text-gray-800 rotate-180">"</div>

                            <div className="text-center py-4 md:py-6">
                                <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-text-light dark:text-text-dark italic mb-3 md:mb-6 px-4">
                                    {currentQuote.text}
                                </p>

                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full mt-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(currentQuote.publishedDate, currentLanguage)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Навигация */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <button
                                onClick={() => changeQuote('prev')}
                                disabled={isAnimating}
                                className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 shadow-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> </svg>  
                            </button>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {currentQuoteIndex + 1} / {shuffledQuotes.length}
                            </div>

                            <button
                                onClick={() => changeQuote('next')}
                                disabled={isAnimating}
                                className="p-3 rounded-full bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 shadow-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
