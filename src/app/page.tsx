'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  // TODO: Implement authentication
  const isAuthenticated = false;

  return (
    <div className="bg-white">
      <div className="relative isolate">
        {/* Background gradient */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your thoughts,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                organized beautifully
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A modern note-taking app that helps you capture, organize, and share your ideas effortlessly.
              Experience the perfect blend of simplicity and power.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/login"
                className="group relative inline-flex items-center gap-x-2 rounded-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-indigo-500 transition-colors duration-200"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Features section */}
          <div className="mx-auto mt-32 max-w-7xl">
            <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-3">
              <div className="bg-white/5 p-8 ring-1 ring-white/10 rounded-2xl backdrop-blur-lg hover:bg-gradient-to-b hover:from-white/10 hover:to-white/5 transition-all duration-300">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">Simple & Intuitive</h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Clean interface that lets you focus on what matters most - your notes and ideas.
                </p>
              </div>
              <div className="bg-white/5 p-8 ring-1 ring-white/10 rounded-2xl backdrop-blur-lg hover:bg-gradient-to-b hover:from-white/10 hover:to-white/5 transition-all duration-300">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">Secure & Private</h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Your notes are encrypted and protected. Only you can access them.
                </p>
              </div>
              <div className="bg-white/5 p-8 ring-1 ring-white/10 rounded-2xl backdrop-blur-lg hover:bg-gradient-to-b hover:from-white/10 hover:to-white/5 transition-all duration-300">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">Always Available</h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Access your notes from anywhere, on any device, at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
