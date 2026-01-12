import React, { useEffect, useRef, useState } from 'react'
import { TiLocationArrow } from 'react-icons/ti'
import Buttton from './Buttton'
import { GiMusicSpell } from "react-icons/gi";
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';


const navItems = ['Nexux', 'Vault', 'Prologue', 'About', 'Contact'];

const Navbar = () => {

    const { y: currentScrollY } = useWindowScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navContainerRef = useRef(null);
    const audioElementRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (currentScrollY === 0) {
            // Topmost position: show navbar without floating-nav
            setIsNavVisible(true);
            navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            // Scrolling down: hide navbar and apply floating-nav
            setIsNavVisible(false);
            navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up: show navbar with floating-nav
            setIsNavVisible(true);
            navContainerRef.current.classList.add("floating-nav");
        }

        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2,
        });
    }, [isNavVisible]);



    const toggleAudioIndicator = async () => {
        const audio = audioElementRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
                setPlaying(true);
            } catch (err) {
                // Autoplay or playback blocked — log for debugging
                console.error('Audio play failed:', err);
            }
        } else {
            audio.pause();
            setPlaying(false);
        }
    }



    return (
        <div ref={navContainerRef} className='fixed inset-x-0 top-4 z-50 h-16 border-none
    transition-all duration-700 sm:inset-x-6'>

            <header className='absolute top-0 w-full' >
                <nav className='flex size-full items-center justify-between p-4'>
                    <div className='flex items-center gap-7'>
                        <img src="/img/logo.png" alt="logo" className='w-10' />
                        <Buttton id='product-button'
                            title='Products'
                            rightIcon={<TiLocationArrow />}
                            containerClass='bg-blue-50 md:flex hidden items-center justify-center gap-1'
                        />
                    </div>
                    <div className='flex h-full items-center'>
                        <div className='hidden md:block'>
                            {navItems.map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className='nav-hover-btn'>{item}
                                </a>
                            ))}
                        </div>

                        <button className='ml-10 flex items-center gap-2 text-white w-12 justify-center'
                            onClick={toggleAudioIndicator}
                            aria-pressed={playing}
                        >
                            {!playing && (
                                <span className=' flex justify-center w-full !ms-0'>
                                    <GiMusicSpell className='inline-block w-6 h-6 music-icon' />
                                </span>
                            )}

                            {playing && (
                                <span className=' audio-bars-wrapper is-playing flex justify-center w-full !ms-0'>
                                    <span className='audio-bars' aria-hidden>
                                        <i className='bar bar-1'></i>
                                        <i className='bar bar-2'></i>
                                        <i className='bar bar-3'></i>
                                        <i className='bar bar-4'></i>
                                        <i className='bar bar-5'></i>
                                    </span>
                                </span>
                            )}

                            <audio ref={audioElementRef}
                                className='hidden'
                                src='/audio/loop.mp3' loop />
                        </button>
                    </div>
                </nav>
            </header>

        </div>
    )
}

export default Navbar