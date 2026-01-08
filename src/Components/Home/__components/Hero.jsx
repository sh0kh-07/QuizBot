import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const [darkMode, setDarkMode] = useState(false);
    const { t, i18n } = useTranslation();

    // Инициализация AOS с поддержкой мобильных
    useEffect(() => {
        const initAOS = () => {
            AOS.init({
                duration: 800,
                once: true,
                offset: 50,
                delay: 100,
                easing: 'ease-in-out',
                mirror: false,
                anchorPlacement: 'top-center',
                disable: false, // ❌ НЕ отключаем на мобильных!
                startEvent: 'DOMContentLoaded',
                initClassName: 'aos-init',
                animatedClassName: 'aos-animate',
            });
        };

        // Гарантируем инициализацию после загрузки DOM
        if (document.readyState === 'complete') {
            initAOS();
        } else {
            window.addEventListener('load', initAOS);
        }

        return () => {
            window.removeEventListener('load', initAOS);
        };
    }, []);

    // Обновление AOS при изменении языка
    useEffect(() => {
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }, [i18n.language]);

    // Инициализация темы
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            // Системные настройки
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setDarkMode(true);
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    const scrollToNextSection = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500 px-4 sm:px-6 lg:px-8">
            {/* Фоновые декоративные элементы */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Мобильные круги (меньше и реже) */}
                <div className="md:hidden">
                    <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-5 bg-black dark:bg-white transition-colors duration-500"></div>
                    <div className="absolute bottom-16 -left-16 w-48 h-48 rounded-full opacity-5 bg-black dark:bg-white transition-colors duration-500"></div>
                </div>

                {/* Десктопные круги */}
                <div className="hidden md:block">
                    <div className="absolute top-1/10 -left-16 w-32 h-32 md:w-64 md:h-64 rounded-full opacity-5 bg-gray-800 dark:bg-gray-200 transition-colors duration-500"></div>
                    <div className="absolute bottom-1/6 -right-16 w-40 h-40 md:w-80 md:h-80 rounded-full opacity-5 bg-gray-800 dark:bg-gray-200 transition-colors duration-500"></div>
                </div>

                {/* Геометрические фигуры */}
                <div className="absolute top-6 left-4 w-10 h-10 opacity-5 border border-black dark:border-white rounded-lg transition-colors duration-500 sm:top-8 sm:left-8 sm:w-12 sm:h-12"></div>
                <div className="absolute bottom-6 right-4 w-12 h-12 opacity-5 border border-black dark:border-white rounded-full transition-colors duration-500 sm:bottom-8 sm:right-8 sm:w-16 sm:h-16"></div>
            </div>

            {/* Контент */}
            <div className="relative z-10 container mx-auto text-center max-w-7xl mt-[70px]">
                <div className="max-w-4xl mx-auto">
                    {/* Бейдж с названием сайта (только мобильный) */}
                    <div
                        className="mb-6 md:hidden"
                        data-aos="fade-down"
                        data-aos-delay="100"
                        data-aos-duration="600"
                    >
                        <span className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            {t('hero.siteName')}
                        </span>
                    </div>

                    {/* Главный заголовок */}
                    <h1
                        className="text-3xl font-bold mb-4 tracking-tight text-text-light dark:text-text-dark transition-colors duration-500 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                        data-aos="fade-up"
                        data-aos-delay="200"
                        data-aos-duration="800"
                        data-aos-once="true"
                    >
                        <span className="block mb-2 md:mb-3">{t('hero.greeting')}</span>
                        <span
                            className="block relative"
                            data-aos="fade-up"
                            data-aos-delay="400"
                            data-aos-duration="800"
                            data-aos-once="true"
                        >
                            <span className="relative z-10 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                {t('hero.mainTitle')}
                            </span>
                        </span>
                    </h1>

                    {/* Подзаголовок */}
                    <h2
                        className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-400 transition-colors duration-500 sm:text-xl md:text-2xl md:mb-3"
                        data-aos="fade-up"
                        data-aos-delay="300"
                        data-aos-duration="800"
                        data-aos-once="true"
                    >
                        {t('hero.subtitle')}
                    </h2>

                    {/* Описание */}
                    <p
                        className="text-base mb-6 max-w-2xl mx-auto leading-relaxed text-gray-700 dark:text-gray-300 transition-colors duration-500 sm:text-lg md:text-xl md:mb-8 lg:mb-10 px-2 sm:px-0"
                        data-aos="fade-up"
                        data-aos-delay="600"
                        data-aos-duration="800"
                        data-aos-once="true"
                    >
                        {t('hero.description')}
                    </p>

                    {/* Кнопка CTA */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12"
                        data-aos="fade-up"
                        data-aos-delay="800"
                        data-aos-duration="800"
                        data-aos-once="true"
                    >
                        <button
                            onClick={scrollToNextSection}
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 active:scale-95 focus:outline-none border bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg dark:hover:shadow-gray-900/50"
                            aria-label={t('hero.ctaButton')}
                        >
                            <span>{t('hero.ctaButton')}</span>
                            <span className="group-hover:translate-y-0.5 transition-transform duration-300 text-lg">
                                ↓
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}